import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UserAuthDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  @Length(42, 42)
  @ApiProperty({
    required: true,
    description: 'Ethereum account address',
    example: '0x264D6BF791f6Be6F001A95e895AE0a904732d473',
    minLength: 42,
    maxLength: 42,
  })
  address: string;

  @IsOptional()
  @IsString()
  // @Length(132, 132)
  @ApiProperty({
    required: false,
    description: 'Signature for message',
    example:
      '0xc5f30a1b7b9a036f8e92b8f4105129bdc29520c6d22f04a1c9e474b47a2c5ead35f2027143eb932cde364f9cc9259fe268afa94f947ce31e8082180a55120fe01b',
    minLength: 132,
    maxLength: 132,
  })
  signature?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'nonce for signature',
    example: '1947276834',
  })
  nonce?: string;
}

export class FindByWalletParams {
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  @Length(42, 42)
  readonly walletAddress: string;
}

export class WalletSignInDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  @Length(42, 42)
  walletAddress: string;

  @IsOptional()
  @IsString()
  signature?: string;
}
