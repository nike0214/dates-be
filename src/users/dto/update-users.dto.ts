import { PickType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUsersDto } from './create-users.dto';

export class UpdateUsersDto extends PartialType(
  PickType(CreateUsersDto, ['walletAddress', 'username']),
) {
  @IsOptional()
  @IsBoolean()
  subscriber: boolean;
}
