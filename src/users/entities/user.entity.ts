import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TypeUser } from '../interfaces'
import * as bcrypt from 'bcrypt'

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

  @Column({ type: 'enum', enum: TypeUser, default: TypeUser.USER })
  type: TypeUser

  @Column()
  password: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Column({ default: true })
  active: boolean

  @BeforeInsert()
  async generateColumns() {
    this.salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password, this.salt)
  }
}
