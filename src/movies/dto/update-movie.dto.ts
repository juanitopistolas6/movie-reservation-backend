import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  title: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  poster: string

  @IsNumber()
  @IsOptional()
  duration: number

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  showtime: Date

  @IsOptional()
  @IsString()
  category: string

  @IsOptional()
  @IsNumber()
  price: number
}
