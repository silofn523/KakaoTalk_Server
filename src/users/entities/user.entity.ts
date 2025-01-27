/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { Chat } from 'src/chats/entities/chat.entity'
import { Messages } from 'src/chats/messages/entities/messages.entity'
import { Friend } from 'src/friend/entities/friend.entity'
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'users'
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'user_id',
    type: 'integer'
  })
  public readonly id: number

  @Column({
    name: 'username',
    unique: true,
    nullable: false,
    type: 'varchar'
  })
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  public readonly username: string // 고유 아이디

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  public readonly password: string

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
    nullable: false
  })
  @IsEmail()
  @IsString()
  public readonly email: string

  @Column({
    name: 'tel',
    type: 'varchar',
    nullable: false,
    unique: true
  })
  @IsPhoneNumber('KR') // 'KR'은 대한민국의 국가 코드
  public readonly tel: string

  @Column({
    name: 'full_name',
    type: 'varchar',
    nullable: false
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  public readonly fullName: string // 이름

  @Column({ 
    name: 'status_message',
    type: 'varchar',
    nullable: true 
  })
  @IsOptional() // 상태메시지는 입력이 선택
  @IsString()
  @MaxLength(255)
  public readonly statusMessage: string // 상태메시지

  @Column({
    name: 'birthday',
    type: 'varchar',
    nullable: false
  })
  @IsString({ message: 'birthday must be a valid ISO 8601 date string :(' })
  @IsNotEmpty()
  public readonly birthday: Date // 생일

  @ManyToMany(() => Chat, (chat) => chat.users, { onDelete: 'CASCADE' })
  @JoinTable()
  public readonly chats: Chat[]

  @OneToMany(() => Messages, (message) => message.author, { cascade: true })
  public readonly messages: Messages

  @OneToMany(() => Friend, (friend) => friend.user, { eager: true })
  public readonly sentFriend: Friend[]

  @OneToMany(() => Friend, (friend) => friend.friend, { eager: true })
  public readonly receivedFriend: Friend[]
}
