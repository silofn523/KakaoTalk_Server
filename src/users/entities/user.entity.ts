/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { Chat } from 'src/chats/entities/chat.entity'
import { Messages } from 'src/chats/messages/entities/messages.entity'
import { Friend } from 'src/friend/entities/friend.entity'
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'users'
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column({ unique: true })
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @IsNotEmpty()
  public readonly username: string // 고유 아이디

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^[a-z A-Z 0-9 !? @]*$/, {
    message: 'password only accepts english and number and !? and @'
  })
  public readonly password: string

  @Column({ unique: true })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'email :('
  })
  public readonly email: string

  @Column({ unique: true })
  @IsNotEmpty()
  @IsPhoneNumber('KR') // 'KR'은 대한민국의 국가 코드
  @Matches(/^010\d{7,8}$/, {
    message: 'Phone number must start with 010 and contain 10 or 11 digits'
  })
  public readonly tel: string

  @Column()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @IsNotEmpty()
  public readonly fullName: string // 이름

  @Column({ nullable: true })
  @IsOptional() // 상태메시지는 입력이 선택
  @IsString()
  @MaxLength(255)
  public readonly statusMessage: string // 상태메시지

  @Column()
  @IsString({ message: 'birthday must be a valid ISO 8601 date string :(' })
  @IsNotEmpty()
  public readonly birthday: Date // 생일

  @ManyToMany(() => Chat, (chat) => chat.users, { onDelete: 'CASCADE' })
  @JoinTable()
  public readonly chats: Chat[]

  @OneToMany(() => Messages, (message) => message.author)
  public readonly messages: Messages

  @OneToMany(() => Friend, (friend) => friend.user, { eager: true })
  public readonly sentFriend: Friend[]

  @OneToMany(() => Friend, (friend) => friend.friend, { eager: true })
  public readonly receivedFriend: Friend[]
}
