import { Category } from 'src/category/entities/category.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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
  poster: string

  @Column()
  showtime: Date

  @Column()
  duration: number

  @ManyToOne(() => Category, (category) => category.id)
  category: Category

  @Column()
  price: number

  @Column({ default: true })
  available: boolean

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
}
