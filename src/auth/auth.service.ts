/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotAcceptableException, UnauthorizedException } from '@nestjs/common'
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcryptjs'
import { LoginDto } from './dto/Login.Dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UsersService
  ) {}

  public async signToken(userId: number, refreshToken: boolean): Promise<string> {
    const payload = {
      id: userId,
      type: refreshToken ? 'refresh' : 'access'
    }
    console.log(userId)
    return this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: refreshToken ? '30d' : '10m'
    })
  }

  public async loginUser(userId: number): Promise<{
    success: boolean
    accessToken?: string
    refreshToken?: string
  }> {
    return {
      success: true,
      accessToken: await this.signToken(userId, false),
      refreshToken: await this.signToken(userId, true)
    }
  }

  public async loginWithEmailAndUsernameAndTel(user: Pick<LoginDto, 'login' | 'password'>): Promise<{
    success: boolean
    accessToken?: string
    refreshToken?: string
  }> {
    const existingUser = await this.checkUser(user)

    return this.loginUser(existingUser)
  }

  public async checkUser(dto: Pick<LoginDto, 'login' | 'password'>): Promise<number> {
    const user = await this.userService.findUserByLogin(dto.login, true)
    
    if (!user || undefined) {
      throw new UnauthorizedException({
        success: false,
        message: 'User or Password Invalid'
      })
    }

    const isPasswordValidated = await bcrypt.compare(dto.password, user.password)

    if (!isPasswordValidated || undefined) {
      throw new UnauthorizedException({
        success: false,
        message: `Invalid password`
      })
    }
    return user.id
  }

  public async verifyToken(token: string): Promise<{ id: number }> {
    try {
      const userId = this.jwt.verify(token) as { id: number }

      return userId
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new NotAcceptableException({
          success: false,
          message: `만료된 토큰입니다`
        })
      }

      if (e instanceof JsonWebTokenError) {
        throw new NotAcceptableException({
          success: false,
          message: `잘못된 토큰입니다`
        })
      }
      throw new InternalServerErrorException('JWT_SERVICE_ERROR')
    }
  }

  public async rotateToken(token: string, refreshToken: boolean): Promise<{
    success: boolean;
    message: string;
    token: { newAccessToken: string; };
  }> { //토큰 재 발급 (만료되었을때 다시 로그인 하는걸 방지)
    const decoded = await this.jwt.verify(token, {
      secret: process.env.JWT_SECRET
    })

    if(decoded.type !== 'refresh') {
      throw new NotAcceptableException({
        success: false,
        message: `토큰 재 발급은 Refresh 토큰으로만 가능합니다`
      })
    }

    const newAccessToken = await this.signToken(decoded.id, refreshToken)

    return {
      success: true,
      message: `토큰 재 발급에 성공했습니다`,
      token: { newAccessToken }
    }
  }
}
