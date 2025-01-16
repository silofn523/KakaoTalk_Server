import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { User } from 'src/users/entities/user.entity'
import { StatusEnum } from 'src/util/enum/status.enum'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Friend extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @IsNotEmpty()
  public readonly fullName: string

  @Column()
  @IsNotEmpty()
  @IsPhoneNumber('KR')
  @Matches(/^010\d{7,8}$/, {
    message: 'Phone number must start with 010 and contain 10 or 11 digits'
  })
  public readonly tel: string

  @Column({
    type: 'enum',
    enum: StatusEnum
  })
  @IsNotEmpty()
  public readonly status: StatusEnum

  @Column()
  @IsNumber()
  public readonly userId: number

  @Column()
  @IsNumber()
  public readonly friendId: number

  @ManyToOne(() => User, (user) => user.sentFriend)
  public readonly user: User

  @ManyToOne(() => User, (user) => user.receivedFriend)
  public readonly friend: User
}
