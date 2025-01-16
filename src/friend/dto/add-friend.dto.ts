import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class CreateFriendDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @IsNotEmpty()
  public readonly fullName: string // 이름

  @IsNotEmpty()
  @IsPhoneNumber('KR') // 'KR'은 대한민국의 국가 코드
  @Matches(/^010\d{7,8}$/, {
    message: 'Phone number must start with 010 and contain 10 or 11 digits'
  })
  public readonly tel: string

  @IsNumber()
  public readonly userId: number
}
