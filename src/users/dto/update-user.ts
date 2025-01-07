import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { TypeUser } from '../interfaces'

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  user: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  password: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string

  @IsNotEmpty()
  @IsEnum({ enum: TypeUser })
  @IsOptional()
  type?: TypeUser
}
