import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateMessage } from 'src/message/entities/date-message.entity';
import { DateInfo } from 'src/message/entities/date.entity';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
// import { DatabaseService } from './database.service';

@Module({
imports: [
  TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => {
      // console.log(configService.get('DB_PORT'));
      return {
        type: 'sqlite',
        database: 'database.sqlite',
        entities: [ User, Message, DateMessage, DateInfo ],
        logging: true,
        synchronize: true,
      };
    },
  }),
],
  // providers: [DatabaseService],
  // exports: [DatabaseService],
})
export class DatabaseModule {}
