/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, ValidationPipe } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { Chat } from './entities/chat.entity'
import { User } from 'src/users/entities/user.entity'
import { UpdateChatDto } from './dto/update-chat.dto'

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  public async createChat(@Body(ValidationPipe) dto: CreateChatDto): Promise<Chat> {
    return await this.chatsService.createChat(dto)
  }

  @Get()
  public findAllChat(): Promise<Chat[]> {
    return this.chatsService.findAllChat()
  }

  @Get(':id')
  public async findOneChat(@Param('id') id: number): Promise<{ success: boolean; body: Chat }> {
    const chat = await this.chatsService.findOneChat(id)

    if (!chat) {
      throw new NotFoundException({
        success: false,
        message: `찾으려는 채팅방 ID가 없습니다. ID : ${id}`
      })
    }
    return {
      success: true,
      body: chat
    }
  }

  @Get(':id/users')
  public async findUsersInChat(@Param('id') id: number): Promise<{ success: boolean; body: User[] }> {
    const chat = await this.chatsService.findUsersInChat(id)

    if (!chat) {
      throw new NotFoundException({
        success: false,
        message: `찾으려는 채팅방 ID가 없습니다. ID : ${id}`
      })
    }

    return {
      success: true,
      body: chat
    }
  }

  @Patch(':id')
  public async patchChatName(@Param('id') id: number, @Body(ValidationPipe) dto: UpdateChatDto): Promise<{ success: boolean }> {
    const chat = await this.chatsService.findOneChat(id)

    if (!chat) {
      throw new NotFoundException({
        success: false,
        message: `찾으려는 채팅방 ID가 없습니다. ID : ${id}`
      })
    }
    await this.chatsService.updateChat(id, dto)

    return {
      success: true
    }
  }

  @Delete(':id')
  public async deleteChat(@Param('id') id: number): Promise<{ success: boolean }> {
    const chat = await this.chatsService.findOneChat(id)

    if (!chat) {
      throw new NotFoundException({
        success: false,
        message: `찾으려는 채팅방 ID가 없습니다. ID : ${id}`
      })
    }

    await this.chatsService.deleteChat(id)

    return {
      success: true
    }
  }
}
