import { Movie, Seat } from 'src/movies/entities'
import { User } from 'src/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ReservationStatus } from '../interfaces'

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User

  @ManyToOne(() => Movie, (movie) => movie.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  movie: Movie

  @ManyToMany(() => Seat, (seat) => seat.id, { onDelete: 'CASCADE' })
  @JoinTable()
  seats: Seat[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
