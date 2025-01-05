import { Module } from '@nestjs/common'
import { MoviesModule } from './movies/movies.module'
import { CategoryModule } from './category/category.module'
import { UsersModule } from './users/users.module'
import { OrdersModule } from './orders/orders.module'
import { ReservationsModule } from './reservations/reservations.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    MoviesModule,
    CategoryModule,
    UsersModule,
    OrdersModule,
    ReservationsModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '6442340710juan1',
        database: 'cinema',
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
