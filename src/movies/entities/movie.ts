import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  showtime: Date

  @Column()
  duration: number

  @Column()
  category: string

  @Column()
  price: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
