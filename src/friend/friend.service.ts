import { ConflictException, Injectable } from '@nestjs/common'
import { CreateFriendDto } from './dto/add-friend.dto'
import { UpdateFriendDto } from './dto/update-friend.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Friend } from './entities/friend.entity'
import { Repository } from 'typeorm'
import { StatusEnum } from 'src/util/enum/status.enum'

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friend: Repository<Friend>
  ) {}

  public async addFriend(dto: CreateFriendDto, status: StatusEnum, friendId: number): Promise<void> {
    await this.friend.insert({
      fullName: dto.fullName,
      tel: dto.tel,
      userId: dto.userId,
      friendId,
      status
    })
  }

  public async isAlreadyFriend(userId: number, friendId: number): Promise<void> {
    const existingFriend = await this.friend.findOne({
      where: [
        { userId, friendId },
        { userId: friendId, friendId: userId } // 양방향 친구 관계 확인
      ]
    })

    if (existingFriend) {
      throw new ConflictException({
        success: false,
        message: `해당 사용자는 이미 친구로 추가되어 있습니다.`
      })
    }
  }

  public removeAll(): void {
    this.friend.delete({})
  }

  public async findAllfriend(): Promise<Friend[]> {
    return await this.friend.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`
  }

  update(id: number, _updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`
  }

  remove(id: number) {
    return `This action removes a #${id} friend`
  }
}
