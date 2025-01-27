import { Module } from '@nestjs/common'
import { FriendService } from './friend.service'
import { FriendController } from './friend.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Friend } from './entities/friend.entity'
import { UsersModule } from 'src/users/users.module'
import { User } from 'src/users/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User]), UsersModule],
  controllers: [FriendController],
  providers: [FriendService]
})
export class FriendModule {}
