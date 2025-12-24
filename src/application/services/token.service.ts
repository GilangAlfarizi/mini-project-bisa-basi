import { GenerateTokenRequest } from '@domain/auth';
import { JwtVerifyOptions } from '@nestjs/jwt';

export abstract class ITokenService {
  abstract generate(req: GenerateTokenRequest): Promise<string>;
  abstract verify<T extends object>(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<T>;
}
