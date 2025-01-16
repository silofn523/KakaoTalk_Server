/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
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

  public async verifyToken(token: string): Promise<{ id: number; type: 'access' | 'refresh' }> {
    const decoded = await this.jwt.verifyAsync(token, { secret: process.env.JWT_SECRET }) as {
      id: number
      type: 'access' | 'refresh'
    }

    return decoded
  }

  public async rotateToken(token: string, refreshToken: boolean): Promise< string > {
    const decoded = await this.jwt.verify(token, {
      secret: process.env.JWT_SECRET
    })

    if(decoded.type !== 'refresh') {
      throw new UnauthorizedException({
        success: false,
        message: `토큰 재 발급은 Refresh 토큰으로만 가능합니다`
      })
    }

    const newAccessToken = await this.signToken(decoded.id, refreshToken)

    return newAccessToken
  }
}
