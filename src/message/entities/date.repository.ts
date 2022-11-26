import { Repository } from 'typeorm';
import { DateInfo } from './date.entity';

export interface DateInfoRepository extends Repository<DateInfo> {}