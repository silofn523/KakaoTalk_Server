import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, NotFoundException } from '@nestjs/common'
import { FriendService } from './friend.service'
import { CreateFriendDto } from './dto/add-friend.dto'
import { UpdateFriendDto } from './dto/update-friend.dto'
import { UsersService } from 'src/users/users.service'
import { StatusEnum } from 'src/util/enum/status.enum'
import { Friend } from './entities/friend.entity'

@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly userService: UsersService
  ) {}

  @Post()
  public async addFriend(@Body(ValidationPipe) dto: CreateFriendDto) {
    const userId = await this.userService.getOneUser(dto.userId)

    const friend = await this.userService.fullNameAndTelCheck(dto.fullName, dto.tel)

    if (!userId) {
      throw new NotFoundException({
        success: false,
        message: `${dto.userId}를 가진 유저를 찾지 못했습니다`
      })
    }

    if (userId.id == friend.id) {
      throw new NotFoundException({
        success: false,
        message: `자기자신은 친구추가 할 수 없습니다`
      })
    }
    await this.friendService.isAlreadyFriend(dto.userId, friend.id)
    await this.friendService.addFriend(dto, StatusEnum.PENDING, friend.id)

    return {
      success: true,
      message: `${friend.fullName}님에게 친구 요청을 보냈습니다.`
    }
  }

  @Get()
  public async findAllfriend(): Promise<{ success: boolean; body: Friend[] }> {
    const friends = await this.friendService.findAllfriend()

    return {
      success: true,
      body: friends
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.update(+id, updateFriendDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendService.remove(+id)
  }

  @Delete()
  public removeAll(): { success: boolean } {
    this.friendService.removeAll()

    return {
      success: true
    }
  }
}
