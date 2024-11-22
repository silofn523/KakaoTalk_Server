/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateChatDto {
  @IsNumber({}, { each: true })
  public readonly userId: number[]

  @IsString()
  @IsOptional()
  public readonly roomName: string
}
