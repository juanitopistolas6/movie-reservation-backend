import { Module } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './entities/order.entity'
import { ReservationsModule } from 'src/reservations/reservations.module'
import { SomeService } from 'src/util/some-service'

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ReservationsModule],
  controllers: [OrdersController],
  providers: [OrdersService, SomeService],
  exports: [OrdersService],
})
export class OrdersModule {}
