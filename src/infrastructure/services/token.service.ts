import { ITokenService } from '@application/services/token.service';
import { GenerateTokenRequest } from '@domain/auth';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { v7 as uuid } from 'uuid';

@Injectable()
export class TokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  generate({ payload, options }: GenerateTokenRequest): Promise<string> {
    return this.jwtService.signAsync({ ...payload, jti: uuid() }, options);
  }

  verify<T extends object>(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, options);
  }
}
