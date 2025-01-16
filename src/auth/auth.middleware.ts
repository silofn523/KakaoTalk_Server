/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request, Response, NextFunction } from 'express'
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return next()
    }

    const token = authHeader.replace('Bearer ', '')

    try {
      const decoded = await this.authService.verifyToken(token)
      req.user = decoded
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          success: false,
          message: '만료된 토큰입니다.'
        })
      }

      if (e instanceof JsonWebTokenError) {
        throw new UnauthorizedException({
          success: false,
          message: '잘못된 토큰입니다.'
        })
      }

      throw new UnauthorizedException({
        success: false,
        message: '토큰 검증 중 오류가 발생했습니다.'
      })
    }

    next()
  }
}
