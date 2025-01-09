import { Controller, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/guards'
import { OrdersService } from './orders.service'
import { GetUser } from 'src/auth/decorators'

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post(':id')
  async createOrder(
    @GetUser('id') idUser: string,
    @Param('id') idReservation: string,
  ) {
    return this.ordersService.createOrder(idUser, idReservation)
  }
}
