import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private requestCount: number = 0;
  private lastTimestamp: number = Date.now();
  private ONE_SECOND_IN_MILISECOND: number = 1000;
  private activeUsers = new Set<string>();

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private logRequestPerSecond(): void {
    const currentTimestamp = Date.now();

    if (
      currentTimestamp - this.lastTimestamp >=
      this.ONE_SECOND_IN_MILISECOND
    ) {
      this.logger.info(`Requests per second: ${this.requestCount}`, {
        context: 'RequestPerSecond',
        count: this.requestCount,
      });
      this.requestCount = 0;
      this.lastTimestamp = currentTimestamp;
    }
  }

  private logResponseTime(
    req: Request,
    res: Response,
    startTime: number,
    errorMessage: string | null,
  ): void {
    const duration = Date.now() - startTime;
    const visitorId = req.headers['x-visitor-id'] || 'VISITOR_UNKNOWN';
    const sessionId = req.headers['x-session-id'] || 'SESSION_UNKNOWN';
    const userId = req['user']?.user || 'USER_UNKNOWN';
    const ip = req.ip || 'IP_UNKNOWN';
    const traceId = req.headers['x-trace-id'] || 'TRACE_UNKNOWN';
    const params = req.params;
    const query = req.query;

    const endpoint = Object.values(params)
      .reduce((endpoint, paramValue) => {
        if (paramValue && typeof paramValue === 'string') {
          return endpoint.replace(paramValue, '*');
        }
        return endpoint;
      }, `${req.method} ${req.originalUrl}`)
      .split('?')[0];

    const requestBody = {
      ...req.body,
      password: null,
      oldPassword: null,
      newPassword: null,
    };

    this.logger.info(`${endpoint} - ${res.statusCode} - ${duration}ms`, {
      context: 'RequestResponse',
      ip,
      visitorId,
      sessionId,
      userId,
      method: req.method,
      url: req.originalUrl,
      endpoint,
      statusCode: res.statusCode,
      responseTime: duration,
      requestBody: res.statusCode >= 400 ? requestBody : null,
      errorMessage,
      traceId,
      query,
      params,
    });
  }

  private logActiveUsers(): void {
    // Log jumlah pengguna aktif setiap kali ada perubahan
    this.logger.info(`Concurrent active users: ${this.activeUsers.size}`, {
      context: 'ActiveUsers',
      activeUsersCount: this.activeUsers.size,
    });
  }

  private safeParse(body: any) {
    try {
      return body && typeof body === 'string' ? JSON.parse(body) : null;
    } catch {
      return null;
    }
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const userId = req['user']?.user || 'USER_UNKNOWN';

    if (userId) {
      // Tambahkan ID pengguna ke dalam Set
      this.activeUsers.add(userId);

      // Log jumlah pengguna aktif
      this.logActiveUsers();
    }

    // Log Requests Per Second every second
    this.requestCount++;
    this.logRequestPerSecond();

    const startTime = Date.now();

    const originalSend = res.send;
    let responseBody: any;

    res.send = (body: any) => {
      responseBody = body;
      return originalSend.call(res, responseBody);
    };

    res.on('finish', () => {
      if (userId) {
        this.activeUsers.delete(userId);
        this.logActiveUsers();
      }

      // Log Response Time
      this.logResponseTime(
        req,
        res,
        startTime,
        this.safeParse(responseBody)?.code ?? null,
      );
    });

    next();
  }
}
