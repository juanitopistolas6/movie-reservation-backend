import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Movie } from './movie.entity'
import { User } from 'src/users/entities/user.entity'
import { SeatStatus } from '../interfaces'

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  seat: string

  @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.AVAILABLE })
  status: SeatStatus

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  owner: User | null

  @ManyToOne(() => Movie, (movie) => movie.id)
  @JoinColumn()
  movie: Movie
}
