import { EthereumSigService } from './../utils/ethereumSig/ethereumSig.service';
import { EthereumJsService } from './../utils/ethereumJs/ethereumJs.service';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  // Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';
import { JwtService } from '@nestjs/jwt';
import { CreateUsersDto } from './dto/create-users.dto';
import {
  UserAuthDto,
  WalletSignInDto,
} from './dto/user-auth.dto';
import { JwtUser } from './interfaces/jwt-user.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { personalSign } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { AuthService } from '../common/guards/auth.service';
import { UserRepository } from './entities/user.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly ethereumJsService: EthereumJsService,
    private readonly ethereumSigService: EthereumSigService,
    // private readonly logger: Logger,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly authService: AuthService,
  ) {}

  getPersonalSignature = (_privateKey: string, nonce: string): string => {
    const privatekey = Buffer.from(_privateKey, 'hex');
    const msgBufferHex = bufferToHex(Buffer.from(nonce, 'utf8'));
    return personalSign(privatekey, { data: msgBufferHex });
  };

  async getSignature(pk: string, nonce: string) {
    return { data: { signature: this.getPersonalSignature(pk, nonce) } };
  }

  async loginUser(userAuthDto: UserAuthDto) {
    const { address, signature } = userAuthDto;

    if (!signature || !address)
      throw new HttpException('Request should have signature and address', 400);

    /**
     * Step 1: Get the user with the given address
     */
    let userNonce: string;
    let userId: string;
    let userInfo:User;
    try {
      userInfo = await this.userRepository.findOneBy(
        {
          walletAddress: userAuthDto.address.toLowerCase(),
        }
      );

      if (!userInfo) {
        throw new UnprocessableEntityException();
      }

      // userNonce = userInfo['nonce'];
      userNonce = userInfo.nonce;
      userId = userInfo.id.toString();
    } catch (err) {
      console.log(err);
      throw new HttpException('Problem with getting user auth info.', 403);
    }

    /**
     * Step 2: Verify digital signature
     */
    // const msg = userNonce;
    // let recoveredAddress;
    // try {
    //   const msgBufferHex = this.ethereumJsService.bufferToHex(msg);
    //   recoveredAddress = this.ethereumSigService.recoverPersonalSignature({
    //     data: msgBufferHex,
    //     sig: signature,
    //   });
    //   // console.log(`Step 2: ${recoveredAddress}`)
    // } catch (err) {
    //   // console.error(err);
    //   throw new HttpException('Problem with signature verification.', 403);
    // }

    // // The signature verification is successful if the address found with
    // // sigUtil.recoverPersonalSignature matches the initial address
    // if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
    //   throw new HttpException('Signature verification failed', 401);
    // }

    /**
     * Step 3: Generate a new nonce for the user
     */
    try {
      await this.updateNonce(address);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Generating a new nonce for the user failed',
        401,
      );
    }

    /**
     * Step 4: Create JWT
     */
    const payload: JwtUser = {
      account_address: address,
      sub: userId,
    };
    let accessToken: string;
    try {
      accessToken = this.jwtService.sign(payload);
    } catch (err) {
      console.log(err);
      throw new HttpException('Creating JWT failed', 401);
    }

    return {
      data: {
        ...userInfo,
        accessToken,
        userId,
      },
    };
  }

  async walletSignIn(
    reqUser: any,
    { walletAddress, signature }: WalletSignInDto,
  ) {
    /**
     * Step 1: Check user and wallet address
     */
    const user = await this.getUserCredentials({ _id: reqUser._id });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    if (user.walletAddress && user.walletAddress !== walletAddress) {
      throw new HttpException(
        'User already connected with another wallet address',
        400,
      );
    }

    const userByWallet = await this.getUserCredentials({ walletAddress });

    if (userByWallet && userByWallet.id.toString() !== user.id.toString()) {
      throw new HttpException(
        'The wallet is already connected with another user',
        400,
      );
    }

    /**
     * Step 2: Verify digital signature
     */
    const { nonce } = user;
    const msgBufferHex = this.ethereumJsService.bufferToHex(nonce);
    const recoveredAddress = this.ethereumSigService.recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    if (recoveredAddress.toLowerCase() !== walletAddress) {
      throw new HttpException('Signature verification failed', 401);
    }

    /**
     * Step 3: Generate a new nonce for the user and save the wallet address
     */
    const newNonce = String(Math.floor(Math.random() * 10000000000));
    const updatedUser = this.userRepository.create({
      ...user,
      nonce: newNonce,
    })
    await this.userRepository.save(updatedUser);

    /**
     * Step 4: Create JWT
     */
    const accessToken = await this.authService.generateWalletJWT(updatedUser);

    return {
      data: { accessToken, ...updatedUser },
    };
  }

  async getUserCredentials(query: object) {
    const user = await this.userRepository.findOneBy(query);

    return user;
  }

  async getCurrentUser(query: object) {
    return await this.userRepository.findOneBy(query);
  }

  private async createDefaultUser(walletAddress: string): Promise<User> {
    // await this.userRepository.deleteOne({
    //   walletAddress: walletAddress.toLowerCase(),
    // });

    const newDefaultUser = new CreateUsersDto();
    newDefaultUser.walletAddress = walletAddress.toLowerCase();
    newDefaultUser.nonce = String(Math.floor(Math.random() * 10000000000));

    let newUser;

    try {
      newUser = this.userRepository.create({
        nonce: newDefaultUser.nonce,
        walletAddress: newDefaultUser.walletAddress,
      });

      await this.userRepository.save(newUser);

      if (!newUser) {
        throw new InternalServerErrorException("Couldn't create user");
      }
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }

    return newUser;
  }

  async retrieveNonce(walletAddress: string) {
    try {
      if (!walletAddress) throw new BadRequestException();
      const user = await this.userRepository.findOneBy({
        walletAddress: walletAddress.toLocaleLowerCase(),
      });

      if (!user) {
        const _user = await this.createDefaultUser(walletAddress);
        return { data: _user || {} };
      }

      return { data: user };
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException('Bad Request');
      throw new InternalServerErrorException('Something goes wrong');
    }
  }

  private async updateNonce(address: string) {
    const newNonce = String(Math.floor(Math.random() * 10000000000));
    await this.userRepository.update(
      { walletAddress: address.toLowerCase() },
      { nonce: newNonce },
    );
  }

  async findByWalletAddress(walletAddress: string) {
    const user = await this.getUserCredentials({ walletAddress });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    return { data: user };
  }

  async retrieveUser(walletAddress: string) {
    try {
      if (!walletAddress) throw new BadRequestException();
      const user = await this.userRepository.findOneBy({
        walletAddress: walletAddress.toLocaleLowerCase(),
      });

      if (!user) {
        throw new UnprocessableEntityException();
      }
      return { data: user };
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException('Bad Request');
      if (error instanceof UnprocessableEntityException)
        throw new UnprocessableEntityException('User not found');
      throw new InternalServerErrorException('Something goes wrong');
    }
  }
}
