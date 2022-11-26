import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DateMessage } from './date-message.entity';
import { Message } from './message.entity';

@Entity('date')
export class DateInfo {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
        name: 'date',
        type: 'varchar',
        })
    date: string;

    @OneToMany(() => DateMessage, dateMessage => dateMessage.date)
    dateMessages: DateMessage[];

    @Column({
        name: 'img_url',
        type: 'varchar',
        })
    imgUrl: string;
}
