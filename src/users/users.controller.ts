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

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('sign-in')
  getNonce(@Query('address') walletAddress: string) {
    return this.usersService.retrieveNonce(walletAddress.toLowerCase());
  }

  @Get('wallet/:walletAddress')
  findByWalletAddress(@Param() { walletAddress }: FindByWalletParams) {
    return this.usersService.findByWalletAddress(walletAddress);
  }

  @Get('check/:walletAddress')
  checkRegisteredWallet(@Param('walletAddress') walletAddress: string) {
    return this.usersService.retrieveUser(walletAddress.toLowerCase());
  }

  @Post('sign-in')
  login(@Body() userAuthDto: UserAuthDto) {
    return this.usersService.loginUser(userAuthDto);
  }
}
