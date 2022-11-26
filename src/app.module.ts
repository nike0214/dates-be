import { EthereumSigModule } from './utils/ethereumSig/ethereumSig.module';
import { EthereumJsModule } from './utils/ethereumJs/ethereumJs.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ExceptionModule } from './common/exceptions/exception.module';
import { DatabaseModule } from './database/database.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { HealthzModule } from './healthz/healthz.module';
import { MessageModule } from './message/message.module';

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'prod'
      ? '.env.prod'
      : process.env.NODE_ENV === 'stage'
      ? '.env.stage'
      : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env.dev',
  ),
});
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test'),
        JWT_SECRET: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
      }),
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level:
            process.env.NODE_ENV === 'prod'
              ? 'info'
              : process.env.NODE_ENV === 'test'
              ? 'debug'
              : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('LABEL', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    UsersModule,
    ExceptionModule,
    DatabaseModule,
    EthereumJsModule.forRoot({
      encoding: 'utf8',
    }),
    EthereumSigModule.forRoot(),
    HealthzModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
