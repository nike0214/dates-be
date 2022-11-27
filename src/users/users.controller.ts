import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FindByWalletParams,
  UserAuthDto,
} from './dto/user-auth.dto';
import { AuthService } from 'src/common/guards/auth.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Get('sign-in')
  @ApiOperation({ summary: 'Nonce값 조회 API', description: '지갑 주소정보를 이용하여 Nonce값을 조회한다. 최초 조회시 자동 회원가입된다' })
  getNonce(@Query('address') walletAddress: string) {
    return this.usersService.retrieveNonce(walletAddress.toLowerCase());
  }

  // @Get('wallet/:walletAddress')
  // findByWalletAddress(@Param() { walletAddress }: FindByWalletParams) {
  //   return this.usersService.findByWalletAddress(walletAddress);
  // }

  // @Get('check/:walletAddress')
  // checkRegisteredWallet(@Param('walletAddress') walletAddress: string) {
  //   return this.usersService.retrieveUser(walletAddress.toLowerCase());
  // }

  @Post('sign-in')
  @ApiOperation({ summary: '로그인 API', description: '지갑 주소정보를 이용하여 로그인한다' })
  @ApiBody({ type: UserAuthDto })
  login(@Body() userAuthDto: UserAuthDto) {
    return this.usersService.loginUser(userAuthDto);
  }
}
