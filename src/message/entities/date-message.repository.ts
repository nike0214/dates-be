import { Repository } from 'typeorm';
import { DateMessage } from './date-message.entity';

export interface DateMessageRepository extends Repository<DateMessage> {}