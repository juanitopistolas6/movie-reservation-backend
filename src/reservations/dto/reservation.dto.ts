import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator'

export class ReservationDto {
  @IsNotEmpty()
  @IsString()
  movie: string

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  seats: string[]
}
