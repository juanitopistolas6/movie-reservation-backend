import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  user: string

  @Column()
  salt: string

  @Column()
  password: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
