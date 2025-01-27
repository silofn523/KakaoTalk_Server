import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { User } from 'src/users/entities/user.entity'
import { StatusEnum } from 'src/util/enum/status.enum'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Friend extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'friend_id',
    type: 'integer'
  })
  public readonly id: number

  @Column({
    name: 'full_name',
    type: 'varchar',
    nullable: false
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  public readonly fullName: string

  @Column({
    name: 'tel',
    type: 'varchar',
    nullable: false
  })
  @IsNotEmpty()
  @IsPhoneNumber('KR')
  public readonly tel: string

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusEnum,
    nullable: false
  })
  public readonly status: StatusEnum

  @Column({
    name: 'userId',
    type: 'integer',
    nullable: false
  })
  @IsNumber()
  public readonly userId: number

  @Column({
    name: 'friendId',
    type: 'integer',
    nullable: false
  })
  @IsNumber()
  public readonly friendId: number

  @ManyToOne(() => User, (user) => user.sentFriend)
  public readonly user: User

  @ManyToOne(() => User, (user) => user.receivedFriend)
  public readonly friend: User
}
