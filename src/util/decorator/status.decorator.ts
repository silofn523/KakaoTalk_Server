import { SetMetadata } from '@nestjs/common'
import { StatusEnum } from 'src/util/enum/status.enum'

export const STATUS_KEY = 'status'
export const Stauts = (...status: StatusEnum[]) => SetMetadata(STATUS_KEY, status)
