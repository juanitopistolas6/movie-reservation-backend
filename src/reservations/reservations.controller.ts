import { Body, Controller, Post, UseGuards } from '@nestjs/common'
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

  @Post()
  @Authorization(TypeUser.ADMIN, TypeUser.USER)
  async makeReservation(
    @GetUser('id') idUser: string,
    @Body() reseverationDto: ReservationDto,
  ) {
    const { movie, seats } = reseverationDto

    return this.reservationService.createReservation(idUser, movie, seats)
  }
}
