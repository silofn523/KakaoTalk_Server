/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common'
import { RoomTypeEnum } from '../enum/roomType.emum'

export const ROOM_TYPE_KEY = 'room_type'
export const RoomType = (...roomType: RoomTypeEnum[]) => SetMetadata(ROOM_TYPE_KEY, roomType)