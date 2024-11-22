/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Messages } from './entities/messages.entity'
import { Repository } from 'typeorm'
import { CreateMessageDto } from './dto/create-messages.dto'

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private readonly messages: Repository<Messages>
  ) {}

  public async createMessage(dto: CreateMessageDto): Promise<Messages> {
    const message = await this.messages.save({
      chat: {
        id: dto.chatId
      },
      author: {
        id: dto.authorId
      },
      message: dto.message
    })

    return await this.messages.findOne({
      where: {
        id: message.id
      },
      relations: {
        chat: true
      }
    })
  }

  public async deleteMessages(id: number): Promise<void> {
    await this.messages.delete({ id })
  }

  public async updateMessages(id: number, message: string) {
    return await this.messages.update({ id }, { message })
  }

  public async getOneMessage(id: number): Promise<Messages> {
    return await this.messages.findOne({
      where: {
        id
      }
    })
  }

  public async findAll(id: number) {
    return await this.messages.find({
      where: {
        chatId: id
      }
    })
  }
}
