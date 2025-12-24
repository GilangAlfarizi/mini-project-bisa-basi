import { DB, schema } from '@database';
import { envsConfig } from '@infrastructure/envs';
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
import { APP_PIPE } from '@nestjs/core';

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
  ],

  providers: [
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
