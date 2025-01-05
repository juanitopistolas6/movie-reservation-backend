import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { TypeUser } from '../interfaces'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  user: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEnum({ enum: TypeUser })
  @IsOptional()
  type?: TypeUser
}
