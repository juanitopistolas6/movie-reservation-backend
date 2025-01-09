import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Movie, Seat } from './entities'
import { Between, Repository } from 'typeorm'
import { CreateMovieDto, IntervalDatesDto, UpdateMovieDto } from './dto'
import { Category } from 'src/category/entities/category.entity'
import { SeatStatus } from './interfaces'

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getMovies(page: number, limit: number) {
    const movies = await this.movieRepository.findAndCount({
      where: { available: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { showtime: 'DESC' },
    })

    return movies[0]
  }

  async movieById(id: string) {
    return this.movieRepository.findOne({ where: { available: true, id } })
  }

  async updateMovie(id: string, updateData: UpdateMovieDto) {
    try {
      const movie = await this.movieRepository.findOne({
        where: {
          available: true,
          id,
        },
      })

      const category = updateData.category
        ? await this.findCategory(updateData.category)
        : movie.category

      return this.movieRepository.save({
        ...movie,
        ...{ updateData, category },
      })
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async createMovie(movieData: CreateMovieDto) {
    try {
      const category = await this.findCategory(movieData.category)

      if (movieData.showtime < new Date())
        throw new BadRequestException(
          'the movie cant be scheduled to a past date',
        )

      const movie = this.movieRepository.create({ ...movieData, category })

      await this.movieRepository.save(movie)

      await this.createSeats(movie)

      return movie
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async getMovieAndSeats(idMovie: string) {
    const movie = await this.getMovie(idMovie, true)
    const seats = await this.getSeats(idMovie)

    return {
      movie,
      seats,
    }
  }

  async getMovie(id: string, dateFilter: boolean) {
    const movie = await this.movieRepository.findOne({
      where: { id, available: true },
    })

    if (!movie) throw new NotFoundException('Movie was not found')
    if (dateFilter && movie.showtime < new Date())
      throw new BadRequestException('Movie is past the current date')

    return movie
  }

  async getMovieByDay(date: Date) {
    const endOfDay = new Date(
      date.getTime() + (23 * 60 * 60 + 59 * 60 + 59) * 1000,
    )

    return this.movieRepository.find({
      where: { showtime: Between(date, endOfDay), available: true },
      order: { showtime: 'DESC' },
    })
  }

  async deleteMovie(id: string) {
    try {
      const movie = await this.movieRepository.findOne({
        where: { available: true, id },
      })

      await this.deleteSeats(id)

      return this.movieRepository.save({ ...movie, available: false })
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async getMoviesDates(intervalDates: IntervalDatesDto) {
    const { endDate, startDate } = intervalDates

    const movies = await this.movieRepository.find({
      where: {
        showtime: Between(startDate, endDate),
        available: true,
      },
    })

    return movies
  }

  async movieByCategory(name: string) {
    const category = await this.categoryRepository.findOne({ where: { name } })

    const movie = await this.movieRepository.find({
      where: {
        available: true,
        category,
      },
    })

    return movie
  }

  async createSeats(movieId: Movie) {
    const rows = ['A', 'B', 'C', 'D', 'F', 'G']
    const seatsPerRow = 15

    try {
      const seats = rows.flatMap((row) => {
        return Array.from({ length: seatsPerRow }, (_, i) => {
          return this.seatRepository.create({
            seat: `${row}${i + 1}`,
            movie: movieId,
          })
        })
      })

      await this.seatRepository.save(seats)
      return true
    } catch (error) {
      console.error('Error creating seats:', error)
      throw new BadRequestException(
        'Failed to create seats. Please try again later.',
      )
    }
  }

  async findCategory(name: string) {
    const category = await this.categoryRepository.findOne({ where: { name } })

    if (!category) throw new BadRequestException('category is not registered')

    return category
  }

  async deleteSeats(idMovie: string) {
    try {
      const seats = await this.seatRepository.find({
        where: {
          movie: { id: idMovie },
        },
      })

      seats.forEach((seat) => {
        seat.status = SeatStatus.CANCELLED
      })

      return this.seatRepository.save(seats)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async getSeats(idMovie: string) {
    const seats = await this.seatRepository.find({
      where: {
        movie: { id: idMovie },
      },
    })

    if (seats.length === 0) throw new NotFoundException('Seats were not found')

    return seats
  }
}
