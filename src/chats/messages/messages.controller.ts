/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, ValidationPipe } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { ChatsService } from '../chats.service'

@Controller('chats/messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly chatsService: ChatsService
  ) {}

  @Get(':id')
  public async findAllChatMessage(@Param('id') id: number) {
    const chatId = await this.chatsService.findOneChat(id)
    const message = await this.messagesService.findAll(id)

    if (!chatId) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 채팅방을 찾지 못했습니다`
      })
    }

    return {
      success: true,
      body: message
    }
  }

  @Patch(':id')
  public async updateMessages(@Param('id') id: number, @Body(ValidationPipe) message: { message: string }): Promise<{ success: boolean }> {
    const messages = await this.messagesService.getOneMessage(id)
    await this.messagesService.updateMessages(id, message.message)

    if (!messages) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 메시지를 찾지 못했습니다`
      })
    }
    console.log(message)

    return {
      success: true
    }
  }

  @Delete(':id')
  public async deleteMessages(@Param('id') id: number): Promise<{ success: boolean }> {
    const messages = await this.messagesService.getOneMessage(id)

    if (!messages) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 메시지를 찾지 못했습니다`
      })
    }

    await this.messagesService.deleteMessages(id)

    return {
      success: true
    }
  }
}
