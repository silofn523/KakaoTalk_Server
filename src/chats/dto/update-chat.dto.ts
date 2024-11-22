/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator'

export class UpdateChatDto {
  @IsString()
  public readonly roomName: string
}
