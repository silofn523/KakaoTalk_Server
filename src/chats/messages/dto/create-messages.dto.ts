/* eslint-disable prettier/prettier */
import { PickType } from '@nestjs/mapped-types'
import { Messages } from '../entities/messages.entity'
import { IsNumber } from 'class-validator'

export class CreateMessageDto extends PickType(Messages, ['message']) {
  @IsNumber()
  public readonly chatId: number

  @IsNumber()
  public readonly authorId: number
}
