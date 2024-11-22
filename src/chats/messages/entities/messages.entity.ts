/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from 'class-validator'
import { Chat } from 'src/chats/entities/chat.entity'
import { User } from 'src/users/entities/user.entity'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  public readonly id: number

  @Column()
  @IsNumber()
  public readonly chatId: number

  @Column()
  @IsNumber()
  public readonly authorId: number

  @Column()
  @IsString()
  public readonly message: string

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  public readonly chat: Chat

  @ManyToOne(() => User, (user) => user.messages)
  public readonly author: User
}
