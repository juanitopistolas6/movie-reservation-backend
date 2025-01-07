import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TypeUser } from 'src/users/interfaces'
import { ROLE_KEY } from '../decorators/authorize'
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<TypeUser[]>(ROLE_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ])

    if (!roles) return true

    const request = ctx.switchToHttp().getRequest()
    const user: User = request['user']

    return roles.includes(user.type)
  }
}
