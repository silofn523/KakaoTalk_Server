/* eslint-disable prettier/prettier */
import { IsNumber } from 'class-validator'

export class EnterChatDto {
  @IsNumber({}, { each: true })
  public readonly chatId: number[]

}
