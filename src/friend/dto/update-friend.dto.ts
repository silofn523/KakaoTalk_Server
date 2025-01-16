import { PartialType } from '@nestjs/mapped-types'
import { CreateFriendDto } from './add-friend.dto'
import { IsNotEmpty } from 'class-validator'
import { StatusEnum } from 'src/util/enum/status.enum'

export class UpdateFriendDto extends PartialType(CreateFriendDto) {
  @IsNotEmpty()
  public readonly status: StatusEnum
}
