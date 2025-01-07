import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto, UpdateUserDto } from './dto'
import { SomeService } from 'src/util/some-service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private someService: SomeService,
  ) {}

  async getAll() {
    return this.userRepository.find({})
  }

  async getUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) throw new NotFoundException('User was not found')

    return user
  }

  async createUser(createUser: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { user: createUser.user },
    })

    if (user) throw new BadRequestException('username is already in used')

    const newUser = this.userRepository.create({ ...createUser })

    await this.userRepository.save(newUser)

    return newUser
  }

  async updateUser(updateData: UpdateUserDto, id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } })

      if (updateData?.password) {
        updateData.password = await this.someService.generatePassword(
          updateData.password,
          user.salt,
        )
      }

      return this.userRepository.save({ ...user, ...updateData })
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }
}
