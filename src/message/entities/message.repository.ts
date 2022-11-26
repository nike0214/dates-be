import { Repository } from 'typeorm';
import { Message } from './message.entity';

export interface MessageRepository extends Repository<Message> {}