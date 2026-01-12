import { UserTokenPayload } from '@domain/auth';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthRequest = createParamDecorator(
  (_, ctx: ExecutionContext): UserTokenPayload => {
    const request = ctx.switchToHttp().getRequest();

    return request['user'];
  },
);
