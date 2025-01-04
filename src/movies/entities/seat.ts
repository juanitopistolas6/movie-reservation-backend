import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Movie } from './movie'
import { User } from 'src/users/entities/user'

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  seat: number

  @Column({ enum: ['available ', 'reserved', 'sold'], default: 'available' })
  status: string

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  owner_id: User | null

  @ManyToOne(() => Movie, (movie) => movie.id)
  @JoinColumn()
  movie_id: Movie
}
