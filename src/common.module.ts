import { DB, schema } from '@database';
import { envsConfig } from '@infrastructure/envs';
import { ResponseInterceptor } from '@infrastructure/interceptors';
import { validationUtils } from '@infrastructure/utils';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import {
  BadRequestException,
  Global,
  HttpStatus,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envsConfig],
    }),
    DrizzlePGModule.registerAsync({
      tag: DB,
      useFactory: () => {
        return {
          pg: {
            connection: 'client',
            config: { connectionString: envsConfig().databaseUrl },
          },
          config: {
            schema: { ...schema },
          },
        };
      },
    }),
    JwtModule.register({
      global: true,
      secret: envsConfig().jwtSecret,
      signOptions: { expiresIn: envsConfig().jwtExpiresIn },
    }),
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory() {
        return new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          exceptionFactory(errors) {
            return new BadRequestException({
              statusCode: HttpStatus.BAD_REQUEST,
              message: validationUtils.getValidationErrorFirstMessage(errors),
              error: 'validation',
            });
          },
        });
      },
    },
  ],
})
export class CommonModule {}
