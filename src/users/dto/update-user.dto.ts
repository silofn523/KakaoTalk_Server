/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  public readonly username: string // 고유 아이디

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^[a-z A-Z 0-9 !? @]*$/, {
    message: 'password only accepts english and number and !? and @'
  })
  public readonly password: string

  @IsOptional()
  @IsEmail()
  @IsString()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'email :('
  })
  public readonly email: string

  @IsOptional()
  @IsPhoneNumber('KR') // 'KR'은 대한민국의 국가 코드
  @Matches(/^010\d{7,8}$/, {
    message: 'Phone number must start with 010 and contain 10 or 11 digits'
  })
  public readonly tel: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  public readonly fullName: string // 이름

  @IsOptional()
  @IsString()
  @MaxLength(255)
  public readonly statusMessage: string

  @IsOptional()
  @IsString({ message: 'birthday must be a valid ISO 8601 date string' })
  public readonly birthday: Date
}
