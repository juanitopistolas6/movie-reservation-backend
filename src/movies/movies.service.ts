import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Movie, Seat } from './entities'
import { Between, Repository } from 'typeorm'
import { CreateMovieDto, IntervalDatesDto, UpdateMovieDto } from './dto'
import { Category } from 'src/category/entities/category.entity'

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

    console.log(movies)

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
}
