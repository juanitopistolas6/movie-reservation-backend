import { Module } from '@nestjs/common'
import { MoviesService } from './movies.service'
import { MoviesController } from './movies.controller'
import { Movie, Seat } from './entities'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Seat])],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}
