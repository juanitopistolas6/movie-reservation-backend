import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty } from 'class-validator'

export class DateDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date
}
