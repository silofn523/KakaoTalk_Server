/* eslint-disable prettier/prettier */
import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, WebSocketServer, WsException, ConnectedSocket } from '@nestjs/websockets'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { Server, Socket } from 'socket.io'
import { EnterChatDto } from './dto/enter-chat.dto'
import { CreateMessageDto } from './messages/dto/create-messages.dto'
import { MessagesService } from './messages/messages.service'
import { UsersService } from 'src/users/users.service'
import { InviteUserDto } from './dto/invite-user.dto'

@WebSocketGateway({
  namespace: 'chats'
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService
  ) {}

  @WebSocketServer()
  public server: Server

  public handleConnection(socket: Socket) {
    console.log(`on connect called : ${socket.id}`)
  }

  @SubscribeMessage('enter_chat')
  public async enterChat(@MessageBody() dto: EnterChatDto, @ConnectedSocket() socket: Socket) {
    for (const chatId of dto.chatId) {
      const exists = await this.chatsService.checkIfChatExists(chatId)

      if (!exists) {
        throw new WsException({
          success: false,
          message: `존재하지 않는 채팅방 입니다. Chat ID : ${chatId}`
        })
      }
    }

    socket.join(dto.chatId.map((x) => x.toString()))
  }

  @SubscribeMessage('send_message')
  public async sendMessage(@MessageBody() dto: CreateMessageDto, @ConnectedSocket() socket: Socket) {
    console.log(dto.message)

    const chatExists = await this.chatsService.checkIfChatExists(dto.chatId)
    const userId = await this.usersService.getOneUser(dto.authorId)

    if (!chatExists) {
      throw new WsException({
        success: false,
        message: `존재하지 않는 채팅방 입니다. Chat ID : ${dto.chatId}`
      })
    }

    if (!userId) {
      throw new WsException({
        success: false,
        message: `존재하지 않는 사용자 입니다. User ID : ${dto.authorId}`
      })
    }

    const message = await this.messagesService.createMessage(dto)

    socket.to(message.chat.id.toString()).emit('receive_message', message.message)
  }

  @SubscribeMessage('invite_user')
  public async inviteUser(@MessageBody() inviteDto: InviteUserDto, @ConnectedSocket() socket: Socket) {
    const { chatId, userId } = inviteDto

    const chatExists = await this.chatsService.checkIfChatExists(chatId)
    const user = await this.usersService.getOneUser(userId)

    if (!chatExists) {
      throw new WsException({
        success: false,
        message: `존재하지 않는 채팅방 입니다. Chat ID : ${chatId}`
      })
    }

    if (!user) {
      throw new WsException({
        success: false,
        message: `존재하지 않는 사용자 입니다. User ID : ${userId}`
      })
    }

    await this.chatsService.addUserToChat(inviteDto)

    const messageDto: CreateMessageDto = {
      chatId,
      authorId: userId,
      message: `${user.fullName}님이 초대되었습니다`
    }
    const message = await this.messagesService.createMessage(messageDto)

    this.server.to(chatId.toString()).emit('receive_message', message.message)
  }

  @SubscribeMessage('leave_chat')
  public async leaveChat(@MessageBody() leaveDto: InviteUserDto, @ConnectedSocket() socket: Socket) {
    const { chatId, userId } = leaveDto

    const chatExists = await this.chatsService.checkIfChatExists(chatId)
    const user = await this.usersService.getOneUser(userId)

    if (!chatExists) {
      throw new WsException({
        success: false,
        message: `존재하지 않는 채팅방 입니다. Chat ID : ${chatId}`
      })
    }

    if (!user) {
      throw new WsException({
        success: false,
        message: `존재하지 않는 사용자 입니다. User ID : ${userId}`
      })
    }

    await this.chatsService.removeUserFromChat(leaveDto)

    const messageDto: CreateMessageDto = {
      chatId,
      authorId: userId,
      message: `${user.fullName}님이 나갔습니다`
    }
    const message = await this.messagesService.createMessage(messageDto)

    this.server.to(chatId.toString()).emit('receive_message', message.message)
    socket.leave(chatId.toString())
  }
}
