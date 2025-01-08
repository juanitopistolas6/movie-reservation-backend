import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { SomeService } from 'src/util/some-service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AuthGuard, SomeService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
