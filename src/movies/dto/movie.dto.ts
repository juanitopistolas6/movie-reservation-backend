import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  poster: string

  @IsNumber()
  @IsNotEmpty()
  duration: number

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  showtime: Date

  @IsString()
  @IsNotEmpty()
  category: string

  @IsNumber()
  @IsNotEmpty()
  price: number
}
