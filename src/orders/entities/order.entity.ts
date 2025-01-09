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

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  total: number

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn()
  user: User

  @ManyToMany(() => Seat, (seat) => seat.id)
  @JoinTable()
  seats: Seat[]

  @ManyToOne(() => Movie, (movie) => movie.id)
  @JoinColumn()
  movie: Movie

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
