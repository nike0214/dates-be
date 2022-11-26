import { Logger, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { DateMessage } from './entities/date-message.entity';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateInfo } from './entities/date.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      DateMessage,
      DateInfo
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService, Logger]
})
export class MessageModule {}
