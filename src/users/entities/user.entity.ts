import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nonce', type: 'varchar', length: 255, nullable: true })
  nonce: string;

  @Column({
    name: 'wallet_address',
    type: 'varchar',
    width: 42,
    nullable: true,
  })
  walletAddress: string;
}
