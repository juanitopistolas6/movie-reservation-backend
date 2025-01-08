import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Reservation } from './entities/reservations.entity'
import { In, Repository } from 'typeorm'
import { MoviesService } from 'src/movies/movies.service'
import { UsersService } from 'src/users/users.service'
import { Movie, Seat } from 'src/movies/entities'
import { SeatStatus } from 'src/movies/interfaces'
import { ReservationStatus } from './interfaces'

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    private moviesService: MoviesService,
    private usersService: UsersService,
  ) {}

  async createReservation(
    idUser: string,
    idMovie: string,
    seatsToFound: string[],
  ) {
    try {
      const user = await this.usersService.getUser(idUser)
      const movie = await this.moviesService.getMovie(idMovie)
      const seats = await this.getSeats(seatsToFound, movie)

      seats.forEach((seat) => {
        seat.status = SeatStatus.RESERVED
        seat.owner = user
      })

      const reservation = this.reservationRepository.create({
        movie,
        seats,
        user,
      })

      await this.seatRepository.save(seats)

      return this.reservationRepository.save(reservation)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async getSeats(seatsArray: string[], movie: Movie) {
    const seatsSet = Array.from(new Set(seatsArray))

    const seats = await this.seatRepository.find({
      where: {
        seat: In(seatsSet),
        movie: { id: movie.id },
        status: SeatStatus.AVAILABLE,
      },
    })

    if (seats.length !== seatsArray.length)
      throw new BadRequestException(
        'some seats couldnt be found or they were unavailable',
      )

    return seats
  }

  async getReservations(idUser: string) {
    const reservations = await this.reservationRepository.find({
      where: { user: { id: idUser } },
    })

    if (!reservations)
      throw new NotFoundException(
        'Reservations were not found under this users account',
      )

    return reservations
  }

  async getReservation(idUser: string, idReservation: string) {
    const reservation = await this.reservationRepository.findOne({
      where: {
        user: { id: idUser },
        id: idReservation,
      },
    })

    if (!reservation) throw new NotFoundException('reservation not found')

    return reservation
  }

  async cancelReservation(idReservation: string, idUser: string) {
    const reservation = await this.getReservation(idUser, idReservation)

    if (reservation.status !== ReservationStatus.PENDING)
      throw new BadRequestException('Error while cancelling reservation')

    reservation.status = ReservationStatus.CANCELLED

    const seatsIds = reservation.seats.map((seat) => {
      return seat.seat
    })

    const seats = await this.getSeats(seatsIds, reservation.movie)

    seats.forEach((seat) => {
      seat.status = SeatStatus.AVAILABLE
      seat.owner = null
    })

    await this.seatRepository.save(seats)

    return this.reservationRepository.save(reservation)
  }

  async reservetationPaid(idReservation: string, idUser: string) {
    const reservation = await this.getReservation(idUser, idReservation)

    if (reservation.status !== ReservationStatus.PENDING)
      throw new BadRequestException('Error while cancelling completing it')

    reservation.status = ReservationStatus.COMPLETED

    const seatsIds = reservation.seats.map((seat) => {
      return seat.seat
    })

    const seats = await this.getSeats(seatsIds, reservation.movie)

    seats.forEach((seat) => {
      seat.status = SeatStatus.SOLD
    })

    await this.seatRepository.save(seats)

    return this.reservationRepository.save(reservation)
  }
}
