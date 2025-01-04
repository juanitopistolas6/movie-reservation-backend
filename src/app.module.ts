import { Module } from '@nestjs/common'
import { MoviesModule } from './movies/movies.module'
import { CategoryModule } from './category/category.module'
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [MoviesModule, CategoryModule, UsersModule, OrdersModule, ReservationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
