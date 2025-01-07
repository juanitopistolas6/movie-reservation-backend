import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class IntervalDatesDto {
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date

  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date
}
