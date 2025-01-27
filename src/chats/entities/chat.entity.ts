/* eslint-disable prettier/prettier */
import { User } from 'src/users/entities/user.entity'
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Messages } from '../messages/entities/messages.entity'
import { RoomTypeEnum } from 'src/util/enum/roomType.emum'

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'chat_id',
    type: 'integer'
  })
  public readonly id: number

  @Column({ 
    name: 'room_name',
    type: 'varchar',
    nullable: true 
  })
  public readonly roomName: string

  @Column({
    name: 'room_type',
    type: 'enum',
    enum: RoomTypeEnum,
    nullable: false
  })
  public readonly roomType: RoomTypeEnum

  @ManyToMany(() => User, (user) => user.chats, { onDelete: 'CASCADE', eager: true })
  public readonly users: User[]

  @OneToMany(() => Messages, (messages) => messages.chat, { cascade: true, eager: true })
  public readonly messages: Messages[]
}
