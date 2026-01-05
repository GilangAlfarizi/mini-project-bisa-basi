import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

import { DomainErrorTranslator } from './domain-error-translator';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const translatedError = DomainErrorTranslator.translate(error);

    response.status(translatedError.getStatus()).json({
      code: translatedError.message,
    });
  }
}
