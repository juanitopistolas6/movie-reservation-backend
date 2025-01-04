import { Movie, Seat } from 'src/movies/entities'
import { User } from 'src/users/entities/user'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  total: number

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User

  @ManyToMany(() => Seat, (seat) => seat.id)
  @JoinColumn()
  seats: Seat[]

  @ManyToOne(() => Movie, (movie) => movie.id)
  @JoinColumn()
  movie: Movie

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
