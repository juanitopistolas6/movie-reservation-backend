import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { SomeService } from 'src/util/some-service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, SomeService],
  controllers: [AuthController],
})
export class AuthModule {}
