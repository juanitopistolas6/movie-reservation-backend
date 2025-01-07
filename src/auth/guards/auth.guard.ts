import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { SomeService } from 'src/util/some-service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private someService: SomeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const token = this.extractToken(request)

    if (!token) throw new UnauthorizedException()

    const payload = await this.someService.verifySignature(token)

    request['user'] = payload.user

    return true
  }

  private extractToken(req: any): string | undefined {
    const [type, token] = req.headers['authorization']?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
