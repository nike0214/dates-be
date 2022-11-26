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

  @IsOptional()
  @IsString()
  username: string = uniqueNamesGenerator({
    dictionaries: [
      adjectives,
      colors,
      animals,
      NumberDictionary.generate({ min: 1, max: 999999 }),
    ],
  });

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEthereumAddress()
  @Length(42, 42)
  walletAddress: string;

  @IsOptional()
  @IsArray()
  kindOfWorks: string[];

  @IsOptional()
  @IsString()
  instagram: string;

  @IsOptional()
  @IsString()
  twitter: string;

  @IsOptional()
  @IsString()
  portfolio: string;

  @IsOptional()
  @IsString()
  discord: string;

  @IsOptional()
  @IsString()
  facebook: string;

  @IsOptional()
  @IsString()
  telegram: string;

  @IsOptional()
  @IsString()
  homepage: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  cover: string;

  @IsOptional()
  @IsString()
  type = 'normal';

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsDate()
  createdAt: Date = new Date();
}
