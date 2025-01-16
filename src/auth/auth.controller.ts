/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, UseGuards, Headers, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/Login.Dto'
import { Request } from 'express'
import { AuthGuard } from './guard/bearer-token.guard'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @Post('login')
  public async loginUser(@Body() dto: LoginDto): Promise<{
    success: boolean
    accessToken?: string
    refreshToken?: string
  }> {
    const { accessToken, refreshToken } = await this.authService.loginWithEmailAndUsernameAndTel(dto)

    return {
      success: true,
      accessToken,
      refreshToken
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  public async findMyProfile(@Headers('authorization') token: string): Promise<{ success: boolean; body: User }> {
    token = token.replace('Bearer ', '')
    const userId = await this.authService.verifyToken(token)
    const user = await this.userService.getOneUser(userId.id)

    return {
      success: true,
      body: user
    }
  }

  @Post('token/access')
  @UseGuards(AuthGuard)
  public async createTokenAccess(@Req() req: Request): Promise<{
    success: boolean
    message: string
    token: string
  }> {
    const token = req.headers.authorization.split(' ')[1]
    const newAccessToken = await this.authService.rotateToken(token, false) // falses는 access토큰 발급

    return {
      success: true,
      message: `토큰 재 발급에 성공했습니다`,
      token: newAccessToken
    }
  }

  @Get('check_token')
  @UseGuards(AuthGuard)
  public async checkToken(@Headers('authorization') token: string): Promise<{
    success: boolean
    body: { userId: { id: number; type: 'access' | 'refresh' } }
  }> {
    token = token.replace('Bearer ', '')
    const userId = await this.authService.verifyToken(token)

    return {
      success: true,
      body: {
        userId
      }
    }
  }
}
