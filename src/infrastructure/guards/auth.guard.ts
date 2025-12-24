import { formatErrorCode } from '@infrastructure/utils';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractHeaderToken(request);

    if (!token) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      request.user = payload;

      return true;
    } catch (error) {
      throw new ForbiddenException(formatErrorCode(error.message));
    }
  }

  private extractHeaderToken(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
