import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ReservationsService } from './reservations.service'
import { Authorization } from 'src/auth/decorators/authorize'
import { TypeUser } from 'src/users/interfaces'
import { GetUser } from 'src/auth/decorators'
import { ReservationDto } from './dto'
import { AuthGuard, RoleGuard } from 'src/auth/guards'

@Controller('reservations')
@UseGuards(AuthGuard, RoleGuard)
export class ReservationsController {
  constructor(private reservationService: ReservationsService) {}

  @Get()
  @Authorization(TypeUser.ADMIN, TypeUser.USER)
  async getReservations(@GetUser('id') idUser: string) {
    return this.reservationService.getReservations(idUser)
  }

  @Get(':id')
  @Authorization(TypeUser.ADMIN, TypeUser.USER)
  async getReservation(
    @GetUser('id') idUser: string,
    @Param('id') idReservation,
  ) {
    return this.reservationService.getReservation(idUser, idReservation)
  }

  @Post()
  @Authorization(TypeUser.ADMIN, TypeUser.USER)
  async makeReservation(
    @GetUser('id') idUser: string,
    @Body() reseverationDto: ReservationDto,
  ) {
    const { movie, seats } = reseverationDto

    return this.reservationService.createReservation(idUser, movie, seats)
  }

  @Delete(':id')
  @Authorization(TypeUser.ADMIN, TypeUser.USER)
  async deleteReservation(
    @GetUser('id') idUser: string,
    @Param('id') idReservation: string,
  ) {
    return this.reservationService.cancelReservation(idReservation, idUser)
  }
}
