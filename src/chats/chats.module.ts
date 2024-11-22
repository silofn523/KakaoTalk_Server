/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { ChatsController } from './chats.controller';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Messages } from './messages/entities/messages.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([ Chat, Messages, User ])],
  providers: [ChatsGateway, ChatsService, MessagesService, UsersService],
  controllers: [ChatsController, MessagesController],
})
export class ChatsModule {}
