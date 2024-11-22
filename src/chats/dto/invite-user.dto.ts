/* eslint-disable prettier/prettier */
import { IsNumber } from 'class-validator'

export class InviteUserDto {
  @IsNumber({}, { each: true })
  public readonly chatId: number

  @IsNumber({}, { each: true })
  public readonly userId: number
}
