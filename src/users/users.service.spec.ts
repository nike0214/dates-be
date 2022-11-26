import { EthereumSigService } from './../utils/ethereumSig/ethereumSig.service';
import { EthereumJsService } from './../utils/ethereumJs/ethereumJs.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  WinstonLogger,
  WinstonModule,
  WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston';
import {
  InternalServerErrorException,
  BadRequestException,
  UnprocessableEntityException,
  HttpException,
} from '@nestjs/common';

const mockRepository = () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
  updateOne: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Model<T>, jest.Mock>>;

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token'),
  verify: jest.fn(),
});

const mockEthereumSigService = () => ({
  recoverPersonalSignature: jest.fn(),
});

const mockEthereumJsService = () => ({
  bufferToHex: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<UsersDocument>;
  let ethereumJsService: EthereumJsService;
  let ethereumSigService: EthereumSigService;
  let jwtService: JwtService;

  const newUserFixture = {
    walletAddress: 'notExistWalletAddress',
    username: 'unable_azure_crow_555731',
    type: 'normal',
    nonce: '5889477236',
  };

  const existUserFixture = {
    walletAddress: '0xc6159eea73133f9813304a272db2203c09b872f1',
    username: 'creator',
    type: 'normal',
    nonce: '5889477236',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot({}),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: '1d',
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        UsersService,
        {
          provide: getModelToken(Users.name),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: WinstonLogger,
          useValue: WINSTON_MODULE_NEST_PROVIDER,
        },
        {
          provide: EthereumJsService,
          useValue: mockEthereumJsService(),
        },
        {
          provide: EthereumSigService,
          useValue: mockEthereumSigService(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    ethereumJsService = module.get<EthereumJsService>(EthereumJsService);
    ethereumSigService = module.get<EthereumSigService>(EthereumSigService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get(getModelToken(Users.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('retrieveNonce', () => {
    it("should return user data when a user's wallet address exist", async () => {
      userRepository.findOne.mockResolvedValue({ ...existUserFixture });
      const result = await service.retrieveNonce(
        existUserFixture.walletAddress,
      );
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(expect.any(Object));
      expect(result.data.walletAddress).toEqual(existUserFixture.walletAddress);
      expect(result.data.username).toEqual(existUserFixture.username);
    });
    it('should return user data when wallet address not exist', async () => {
      userRepository.findOne.mockReturnValue(null);
      const result = await service.retrieveNonce(newUserFixture.walletAddress);
      expect(userRepository.findOne).toHaveBeenCalledTimes(2);
      expect(userRepository.findOne).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toHaveProperty('data');
    });

    it('should fail on exception', async () => {
      try {
        userRepository.findOne.mockRejectedValue(new Error('Error'));
        await service.retrieveUser(newUserFixture.walletAddress);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });

    it('should fail on without walletAddress', async () => {
      try {
        await service.retrieveUser(null);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('retrieveUser', () => {
    it('should return error if user not exist', async () => {
      try {
        userRepository.findOne.mockReturnValue(null);
        await service.retrieveUser(newUserFixture.walletAddress);
        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith(expect.any(Object));
      } catch (error) {
        expect(error).toBeInstanceOf(UnprocessableEntityException);
      }
    });

    it('should fail on exception', async () => {
      try {
        userRepository.findOne.mockRejectedValue(new Error('Error'));
        await service.retrieveUser(newUserFixture.walletAddress);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });

    it('should fail on without walletAddress', async () => {
      try {
        await service.retrieveUser(undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return user data when wallet address exist', async () => {
      userRepository.findOne.mockResolvedValue({ ...existUserFixture });
      const result = await service.retrieveUser(existUserFixture.walletAddress);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(expect.any(Object));
      expect(result.data.walletAddress).toEqual(existUserFixture.walletAddress);
      expect(result.data.username).toEqual(existUserFixture.username);
    });
  });

  describe('update', () => {
    it('should fail on without walletAddress', async () => {
      try {
        await service.update({ username: '' });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should fail on without userName', async () => {
      try {
        await service.update({ walletAddress: '' });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should fail on user not exist', async () => {
      try {
        userRepository.findOneAndUpdate.mockReturnValue(null);
        await service.update({ ...existUserFixture });
        expect(userRepository.findOneAndUpdate).toHaveBeenCalledTimes(1);
        expect(userRepository.findOneAndUpdate).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UnprocessableEntityException);
      }
    });
    it('should updated user data', async () => {
      userRepository.findOneAndUpdate.mockReturnValue({
        ...existUserFixture,
        type: 'creator',
        status: 'pending',
      });
      const result = await service.update({ ...existUserFixture });
      expect(userRepository.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneAndUpdate).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Object),
      );
      expect(result.data).toEqual({
        ...existUserFixture,
        type: 'creator',
        status: 'pending',
      });
    });
  });

  describe('loginUser', () => {
    it('should fail on undefined signature', async () => {
      try {
        await service.loginUser({ address: undefined });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should fail on if user not exist', async () => {
      try {
        userRepository.findOne.mockReturnValue(null);
        await service.loginUser({
          address: newUserFixture.walletAddress,
          signature: 'sig',
          nonce: newUserFixture.nonce,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Problem with getting user auth info.');
        expect(error.status).toEqual(403);
      }
    });

    it('should fail on if signature cannot be changed to buffer', async () => {
      try {
        userRepository.findOne.mockReturnValue({ ...existUserFixture });
        jest.spyOn(ethereumJsService, 'bufferToHex').mockImplementation(() => {
          throw new Error();
        });
        await service.loginUser({
          address: newUserFixture.walletAddress,
          signature: 'sig',
          nonce: newUserFixture.nonce,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Problem with signature verification.');
        expect(error.status).toEqual(403);
      }
    });

    it('should fail on if signature cannot be recovered with personal signature', async () => {
      try {
        userRepository.findOne.mockReturnValue({ ...existUserFixture });
        jest
          .spyOn(ethereumSigService, 'recoverPersonalSignature')
          .mockImplementation(() => {
            throw new Error();
          });
        await service.loginUser({
          address: newUserFixture.walletAddress,
          signature: 'sig',
          nonce: newUserFixture.nonce,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Problem with signature verification.');
        expect(error.status).toEqual(403);
      }
    });

    it('should fail on if recovered address is not matched user address', async () => {
      try {
        userRepository.findOne.mockReturnValue({ ...existUserFixture });
        jest
          .spyOn(ethereumSigService, 'recoverPersonalSignature')
          .mockImplementation(() => {
            return 'not-matched-address';
          });
        await service.loginUser({
          address: newUserFixture.walletAddress,
          signature: 'sig',
          nonce: newUserFixture.nonce,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Signature verification failed');
        expect(error.status).toEqual(401);
      }
    });

    it('should fail with error by updating nonce with user address', async () => {
      try {
        userRepository.findOne.mockReturnValue({
          ...existUserFixture,
          address: existUserFixture.walletAddress.toLowerCase(),
        });
        userRepository.updateOne.mockRejectedValue(new Error());
        jest
          .spyOn(ethereumSigService, 'recoverPersonalSignature')
          .mockImplementation(() => {
            return existUserFixture.walletAddress.toLowerCase();
          });
        await service.loginUser({
          address: existUserFixture.walletAddress,
          signature: 'sig',
          nonce: existUserFixture.nonce,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual(
          'Generating a new nonce for the user failed',
        );
        expect(error.status).toEqual(401);
      }
    });

    it('should fail on jwt sign error', async () => {
      try {
        userRepository.findOne.mockReturnValue({
          ...existUserFixture,
          address: existUserFixture.walletAddress.toLowerCase(),
        });
        userRepository.updateOne.mockReturnValue({
          address: existUserFixture.walletAddress,
          nonce: String(Math.floor(Math.random() * 10000000000)),
        });
        jest.spyOn(jwtService, 'sign').mockImplementation(() => {
          throw new Error();
        });
        jest
          .spyOn(ethereumSigService, 'recoverPersonalSignature')
          .mockImplementation(() => {
            return existUserFixture.walletAddress.toLowerCase();
          });
        await service.loginUser({
          address: existUserFixture.walletAddress,
          signature: 'sig',
          nonce: existUserFixture.nonce,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toEqual('Creating JWT failed');
        expect(error.status).toEqual(401);
      }
    });
    it('should return with user and accessToken', async () => {
      userRepository.findOne.mockReturnValue({
        ...existUserFixture,
        address: existUserFixture.walletAddress.toLowerCase(),
      });
      userRepository.updateOne.mockReturnValue({
        address: existUserFixture.walletAddress,
        nonce: String(Math.floor(Math.random() * 10000000000)),
      });
      jest
        .spyOn(ethereumSigService, 'recoverPersonalSignature')
        .mockImplementation(() => {
          return existUserFixture.walletAddress.toLowerCase();
        });
      const result = await service.loginUser({
        address: existUserFixture.walletAddress,
        signature: 'sig',
        nonce: existUserFixture.nonce,
      });
      expect(result.data).not.toHaveProperty('nonce');
      expect(result.data).toHaveProperty('accessToken');
    });
  });
});
