import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DateInfo } from './date.entity';
import { Message } from './message.entity';

@Entity('date_messages')
export class DateMessage {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Message, message => message.id, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'message_id' })
    message: number;

    @ManyToOne(() => DateInfo, dateInfo => dateInfo.id)
    @JoinColumn({ name: 'date_id' })
    date: number;
}
