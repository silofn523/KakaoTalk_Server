/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from 'class-validator'
import { Chat } from 'src/chats/entities/chat.entity'
import { User } from 'src/users/entities/user.entity'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'messages_id',
    type: 'integer'
  })
  public readonly id: number

  @Column({
    name: 'chatId',
    type: 'integer',
    nullable: false
  })
  @IsNumber()
  public readonly chatId: number

  @Column({
    name: 'authorId',
    type: 'integer',
    nullable: false
  })
  @IsNumber()
  public readonly authorId: number

  @Column({
    name: 'message',
    type: 'varchar',
    nullable: false
  })
  @IsString()
  public readonly message: string

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  public readonly chat: Chat

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  public readonly author: User
}
