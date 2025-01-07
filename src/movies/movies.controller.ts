import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { Authorization } from 'src/auth/decorators/authorize'
import { AuthGuard, RoleGuard } from 'src/auth/guards'
import { TypeUser } from 'src/users/interfaces'
import {
  CreateMovieDto,
  DateDto,
  IntervalDatesDto,
  PaginationDto,
  UpdateMovieDto,
} from './dto'
import { MoviesService } from './movies.service'

@Controller('movies')
@UseGuards(AuthGuard, RoleGuard)
export class MoviesController {
  constructor(private movieService: MoviesService) {}

  @Get()
  @Authorization(TypeUser.ADMIN, TypeUser.USER)
  async getMovies(@Query() pagination: PaginationDto) {
    const { limit, page } = pagination

    return this.movieService.getMovies(page, limit)
  }

  @Get('interval')
  @Authorization(TypeUser.ADMIN, TypeUser.USER)
  async getMoviesByDates(@Query() intervalDates: IntervalDatesDto) {
    return this.movieService.getMoviesDates(intervalDates)
  }

  @Get('date')
  @Authorization(TypeUser.ADMIN, TypeUser.USER)
  async getMovieByDate(@Query() dateQuery: DateDto) {
    const { date } = dateQuery

    return this.movieService.getMovieByDay(date)
  }

  @Get('category')
  @Authorization(TypeUser.ADMIN, TypeUser.USER)
  async moviesCategory(@Query('name') name: string) {
    return this.movieService.movieByCategory(name)
  }

  @Get(':id')
  @Authorization(TypeUser.USER, TypeUser.ADMIN)
  async getMovieId(@Param('id') id: string) {
    return this.movieService.movieById(id)
  }

  @Post()
  @Authorization(TypeUser.ADMIN)
  async createMovie(@Body() createMovie: CreateMovieDto) {
    return this.movieService.createMovie(createMovie)
  }

  @Patch(':id')
  @Authorization(TypeUser.ADMIN)
  async updateMovie(
    @Param('id') id: string,
    @Body() updateMovie: UpdateMovieDto,
  ) {
    return this.movieService.updateMovie(id, updateMovie)
  }

  @Delete(':id')
  @Authorization(TypeUser.ADMIN)
  async deleteMovie(@Param('id') id: string) {
    return this.movieService.deleteMovie(id)
  }
}
