import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      name: 'message',
      type: 'varchar',
    })
    message: string;

    @Column({
        name: 'wallet_address',
        type: 'varchar',
        })
    walletAddress: string;
}
