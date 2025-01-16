/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateChatDto } from './dto/create-chat.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Chat } from './entities/chat.entity'
import { UsersService } from 'src/users/users.service'
import { User } from 'src/users/entities/user.entity'
import { WsException } from '@nestjs/websockets'
import { InviteUserDto } from './dto/invite-user.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { RoomTypeEnum } from 'src/util/enum/roomType.emum'

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chat: Repository<Chat>,
    private readonly userService: UsersService
  ) {}

  public async createChat(dto: CreateChatDto, roomType: RoomTypeEnum): Promise<Chat> {
    for (let i = 0; i < dto.userId.length; i++) {
      const user = await this.userService.getOneUser(dto.userId[i])

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: `${dto.userId[i]}를 가진 유저를 찾지 못했습니다`
        })
      }
    }
    const chat = await this.chat.save({
      users: dto.userId.map((id) => ({ id })),
      roomName: dto.roomName,
      roomType: roomType
    })

    return this.chat.findOne({
      where: {
        id: chat.id
      }
    })
  }

  public async checkIfChatExists(chatId: number): Promise<Chat> {
    return await this.chat.findOne({
      where: {
        id: chatId
      }
    })
  }

  public findAllChat(): Promise<Chat[]> {
    return this.chat.find()
  }

  public async findOneChat(id: number): Promise<Chat> {
    return await this.chat.findOne({
      where: {
        id
      }
    })
  }

  public async updateChat(id: number, dto: UpdateChatDto): Promise<void> {
    await this.chat.update({ id }, dto)
  }

  public async deleteChat(id: number): Promise<void> {
    await this.chat.delete({ id })
  }

  public async addUserToChat(dto: InviteUserDto): Promise<void> {
    const chat = await this.chat.findOne({
      where: {
        id: dto.chatId
      },
      relations: ['users']
    })

    if (!chat) {
      throw new NotFoundException({
        success: false,
        message: `존재하지 않는 채팅방 입니다. Chat ID : ${dto.chatId}`
      })
    }

    const user = await this.userService.getOneUser(dto.userId)

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: `존재하지 않는 사용자 입니다. User ID : ${dto.userId}`
      })
    }

    const isUserAlreadyInChat = chat.users.some((u) => u.id === dto.userId)

    if (isUserAlreadyInChat) {
      throw new WsException({
        success: false,
        message: `사용자 ${dto.userId}은 이미 채팅방에 있습니다.`
      })
    }

    chat.users.push(user)
    await this.chat.save(chat)
  }

  public async removeUserFromChat(dto: InviteUserDto): Promise<void> {
    const chat = await this.chat.findOne({
      where: {
        id: dto.chatId
      },
      relations: ['users']
    })

    if (!chat) {
      throw new NotFoundException({
        success: false,
        message: `존재하지 않는 채팅방 입니다. Chat ID : ${dto.chatId}`
      })
    }

    await this.chat.createQueryBuilder().relation(Chat, 'users').of(dto.chatId).remove(dto.userId)
  }

  public async findUsersInChat(chatId: number): Promise<User[]> {
    const chat = await this.chat.findOne({
      where: {
        id: chatId
      },
      relations: ['users']
    })

    if (!chat) {
      throw new NotFoundException({
        success: false,
        message: `존재하지 않는 채팅방 입니다. Chat ID : ${chatId}`
      })
    }

    return chat.users
  }
}
