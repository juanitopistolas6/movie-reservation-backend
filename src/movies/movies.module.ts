import { Module } from '@nestjs/common'
import { MoviesService } from './movies.service'
import { MoviesController } from './movies.controller'
import { Movie, Seat } from './entities'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SomeService } from 'src/util/some-service'
import { Category } from 'src/category/entities/category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Seat, Category])],
  providers: [MoviesService, SomeService],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
