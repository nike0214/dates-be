import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRepository } from './entities/message.repository';
import { Message } from './entities/message.entity';
import { DateMessageRepository } from './entities/date-message.repository';
import { DateMessage } from './entities/date-message.entity';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { DateInfo } from './entities/date.entity';
import { DateInfoRepository } from './entities/date.repository';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: MessageRepository,
    @InjectRepository(DateMessage)
    private dateMessageRepository: DateMessageRepository,
    @InjectRepository(DateInfo)
    private dateInfoRepository: DateInfoRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}
  async create(user, createMessageDto: CreateMessageDto) {
    try {
      // retrive user from db by wallet address and check if user write message for date
    const isDuplicatedMessage = await this.dateMessageRepository
    .createQueryBuilder('date_message')
      .leftJoinAndSelect('date_message.message', 'message')
      .leftJoinAndSelect('date_message.date', 'dateInfo')
      .where('dateInfo.date = :date', { date: createMessageDto.date })
      .andWhere('message.walletAddress = :walletAddress', { walletAddress: user.walletAddress })
      .getOne();

    if (isDuplicatedMessage) {
      throw new BadRequestException('User already write message for date');
    }

    // create and save message to message table
    const message = this.messageRepository.create({
      ...createMessageDto,
      walletAddress: user.walletAddress,
    });
    const savedMessage = await this.messageRepository.save(message);

    // create and save dateMessage to date_message table
    const dateInfo = await this.dateInfoRepository
    .findOne({ where: {
      date: createMessageDto.date},
    select: ['id']});

    const dateMessage = this.dateMessageRepository.create({
      message: savedMessage.id,
      date: dateInfo.id,
    });
    const savedDateMessage = await this.dateMessageRepository.save(
      dateMessage,
    );
    
    // log the saved message
    this.logger.log(savedMessage);
    return savedMessage;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);    }
    
  }

  async findOne(date: string) {
    // retrieve message from db by date
    const result = await this.dateInfoRepository
    .createQueryBuilder('dateInfo')
    .leftJoinAndSelect('dateInfo.dateMessages', 'dateMessage')
    .leftJoinAndSelect('dateMessage.message', 'message')
    .where('dateInfo.date = :date', { date })
    .getOne();

    return {code: 1, data: result};
    
  }

  async update(user:any, id: number, updateMessageDto: UpdateMessageDto) {
    try {
      const isRightUser = await this.messageRepository.findOne({
        where: {
          walletAddress: user.walletAddress,
          id,
        },
      });
      if (!isRightUser) {
        throw new BadRequestException('User is not allowed to update this message');
      }

    // update message by id
    const result = await this.messageRepository.save({
      id,
      ...updateMessageDto,
    });
    return {code: 1, data: result};
    } catch (error) {
      this.logger.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(user:any, id: number) {
    try {
      const isRightUser = await this.messageRepository.findOne({
        where: {
          walletAddress: user.walletAddress,
          id,
        },
      });
      if (!isRightUser) {
        throw new BadRequestException('User is not allowed to delete this message');
      }

    // update message by id
    const result = await this.messageRepository.delete(id);
    return {code: 1, data: result};
    } catch (error) {
      this.logger.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
