import { Module } from '@nestjs/common'
import { ReservationsController } from './reservations.controller'
import { ReservationsService } from './reservations.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reservation } from './entities/reservations.entity'
import { Seat } from 'src/movies/entities'
import { MoviesModule } from 'src/movies/movies.module'
import { UsersModule } from 'src/users/users.module'
import { SomeService } from 'src/util/some-service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Seat]),
    MoviesModule,
    UsersModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, SomeService],
})
export class ReservationsModule {}
