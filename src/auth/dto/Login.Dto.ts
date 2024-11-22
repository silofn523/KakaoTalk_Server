/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  readonly login: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/^[a-z A-Z 0-9 !? @]*$/, {
    message: 'password only accepts english and number and !? and @'
  })
  readonly password: string
}
