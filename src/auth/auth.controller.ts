/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Req, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/Login.Dto'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async loginUser(@Body() dto: LoginDto): Promise<{
    success: boolean
    accessToken?: string
    refreshToken?: string
  }> {
    return await this.authService.loginWithEmailAndUsernameAndTel(dto)
  }

  @Post('token/access')
  public async createTokenAccess(@Req() req: Request): Promise<{
    success: boolean;
    message: string;
    token: { newAccessToken: string; };
  }> {
    const authHeader = await req.headers['authorization']

    if (!authHeader) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authorization header missing'
      })
    }
    const token = await authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException({
        success: false,
        message: 'Token missing'
      })
    }
    await this.authService.verifyToken(token)

    return await this.authService.rotateToken(token, false) // falses는 access토큰 발급 
  }

  @Get('check_token')
  public async checkToken(@Req() req: Request) {
    const authHeader = await req.headers['authorization']

    if (!authHeader) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authorization header missing'
      })
    }

    const token = await authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException({
        success: false,
        message: 'Token missing'
      })
    }
    const userId = await this.authService.verifyToken(token)

    return {
      success: true,
      body: {
        userId,
        token
      }
    }
  }
}
