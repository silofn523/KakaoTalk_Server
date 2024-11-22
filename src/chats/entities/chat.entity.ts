/* eslint-disable prettier/prettier */
import { User } from 'src/users/entities/user.entity'
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Messages } from '../messages/entities/messages.entity'

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column({ nullable: true })
  public readonly roomName: string

  @ManyToMany(() => User, (user) => user.chats, { onDelete: 'CASCADE', eager: true })
  public readonly users: User[]

  @OneToMany(() => Messages, (messages) => messages.chat, { cascade: true, eager: true })
  public readonly messages: Messages
}
