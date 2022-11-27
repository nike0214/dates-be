import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsDate,
  IsEthereumAddress,
  IsEmail,
  IsArray,
} from 'class-validator';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  NumberDictionary,
} from 'unique-names-generator';

export class CreateUsersDto {
  @IsOptional()
  @IsString()
  nonce: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEthereumAddress()
  @Length(42, 42)
  walletAddress: string;

  @IsOptional()
  @IsDate()
  createdAt: Date = new Date();
}
