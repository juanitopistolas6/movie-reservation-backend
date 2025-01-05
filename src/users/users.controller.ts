import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { Authorization } from 'src/auth/decorators/authorize'
import { AuthGuard, RoleGuard } from 'src/auth/guards'
import { TypeUser } from './interfaces'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto'

@Controller('users')
@UseGuards(AuthGuard, RoleGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Authorization(TypeUser.ADMIN)
  @Get()
  async getUsers() {
    return this.userService.getAll()
  }

  @Authorization(TypeUser.ADMIN)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id)
  }

  @Authorization(TypeUser.ADMIN)
  @Post()
  async createUser(@Body() createUser: CreateUserDto) {
    return this.userService.createUser(createUser)
  }

  @Authorization(TypeUser.ADMIN)
  @Patch()
  async updateUser() {}
}
