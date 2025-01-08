import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { Repository } from 'typeorm'
import { LoginDto, RegisterDto } from './dto'
import { SomeService } from 'src/util/some-service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private someService: SomeService,
  ) {}

  async login(loginDto: LoginDto) {
    const { user: inputUser, password } = loginDto
    const user = await this.userRepository.findOne({
      where: { user: inputUser },
    })

    if (!user) throw new UnauthorizedException('User not found')

    const isPasswordValid = await this.someService.verifyPassword(
      user.password,
      password,
      user.salt,
    )

    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials')

    delete user.password
    delete user.salt

    const token = await this.someService.generateSignature({ user: user })

    return {
      token,
      user: user,
    }
  }

  async register(registerDto: RegisterDto) {
    const { user } = registerDto
    const userFound = await this.userRepository.findOne({ where: { user } })

    if (userFound) throw new UnauthorizedException('User already exists')

    const userCreated = this.userRepository.create({ ...registerDto })

    await this.userRepository.save(userCreated)

    delete userCreated.password
    delete userCreated.salt

    return userCreated
  }
}
