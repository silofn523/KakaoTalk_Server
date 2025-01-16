/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { AuthGuard } from 'src/auth/guard/bearer-token.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  public async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<{ success: boolean; body: number }> {
    const { tel, username, email } = createUserDto

    await this.usersService.checkUserTelAndUsernameAndEmail(tel, username, email)
    const userId = await this.usersService.createUser(createUserDto)

    return {
      success: true,
      body: userId
    }
  }

  @Get()
  public async findAllUser(): Promise<{ success: boolean; body: User[] }> {
    const users = await this.usersService.findAllUser()

    return {
      success: true,
      body: users
    }
  }

  @Get(':id')
  public async getOneUser(@Param('id') id: number): Promise<{ success: boolean; body: User | void }> {
    const user = await this.usersService.getOneUser(id)

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 유저를 찾지 못했습니다`
      })
    }

    return {
      success: true,
      body: user
    }
  }

  @Patch(':id/update')
  public async updateUserStatus(@Param('id') id: number, @Body(ValidationPipe) updateUserDto: UpdateUserDto): Promise<{ success: boolean; userId: number }> {
    const user = await this.usersService.getOneUser(id)

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 유저를 찾지 못했습니다`
      })
    }

    await this.usersService.updateUserStatus(id, updateUserDto)

    return {
      success: true,
      userId: user.id
    }
  }

  @Delete(':id')
  public async deleteUser(@Param('id') id: number, @Body() password: string): Promise<{ success: boolean }> {
    const user = await this.usersService.getOneUser(id)

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 유저를 찾지 못했습니다`
      })
    }

    await this.usersService.deleteUser(id)

    return {
      success: true
    }
  }
}
