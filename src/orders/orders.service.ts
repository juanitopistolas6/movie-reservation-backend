/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './entities/order.entity'
import { Repository } from 'typeorm'
import { ReservationsService } from 'src/reservations/reservations.service'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private reservationService: ReservationsService,
  ) {}

  async createOrder(idUser: string, idReservation: string) {
    try {
      const { createdAt, id, status, ...reservation } =
        await this.reservationService.reservetationPaid(idReservation, idUser)

      const total = reservation.movie.price * reservation.seats.length

      const order = this.orderRepository.create({
        ...reservation,
        user: { id: reservation.user.id },
        total,
      })

      return this.orderRepository.save(order)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }
}
