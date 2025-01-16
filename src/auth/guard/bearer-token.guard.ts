/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    if (!request.user || request.user === undefined) {
      throw new UnauthorizedException({
        success: false,
        message: '인증되지 않은 사용자입니다.'
      })
    }

    return true
  }
}
