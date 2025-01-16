/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, NotFoundException, Headers } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { AuthGuard } from 'src/auth/guard/bearer-token.guard'
import { AuthService } from 'src/auth/auth.service'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

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

  @Patch('status/update')
  @UseGuards(AuthGuard)
  public async updateUserStatus(@Headers('authorization') token: string, @Body(ValidationPipe) dto: UpdateUserDto) {
    token = token.replace('Bearer ', '')

    const userId = await this.authService.verifyToken(token)
    await this.usersService.updateUserStatus(userId.id, dto)

    return {
      success: true,
      message: `ID : ${userId.id}님의 정보가 업데이트 되었습니다.` 
    }
  }

  @Delete('status/delete')
  @UseGuards(AuthGuard)
  public async deleteUserStatus(@Headers('authorization') token: string) {
    token = token.replace('Bearer ', '')

    const userId = await this.authService.verifyToken(token)
    await this.usersService.deleteUser(userId.id)

    return {
      success: true,
      message: `ID : ${userId.id}님의 계정이 삭제되었습니다.` 
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
  public async updateUser(@Param('id') id: number, @Body(ValidationPipe) updateUserDto: UpdateUserDto): Promise<{ success: boolean; userId: number }> {
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
  public async deleteUser(@Param('id') id: number): Promise<{ success: boolean }> {
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
