import {
  ArgumentsHost,
  ExceptionFilter,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { DomainErrorTranslator } from './domain-error-translator';

export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const ip = request.ip || 'IP_UNKNOWN';
    const userId = request['user']?.user || 'USER_UNKNOWN';
    const visitorId = request.headers['x-visitor-id'] || 'VISITOR_UNKNOWN';
    const sessionId = request.headers['x-session-id'] || 'SESSION_UNKNOWN';
    const traceId = request.headers['x-trace-id'] || 'TRACE_UNKNOWN';

    const translatedError = DomainErrorTranslator.translate(error);

    if (translatedError instanceof InternalServerErrorException) {
      this.logger.error('Unhandled Internal Server Error', {
        context: 'UnhandledInternalError',
        method: request.method,
        url: request.url,
        message: error.message,
        stack: error.stack,
        ip,
        userId,
        visitorId,
        sessionId,
        traceId,
      });
    }

    // Response ke client
    response.status(translatedError.getStatus()).json({
      code: translatedError.message,
    });
  }
}
