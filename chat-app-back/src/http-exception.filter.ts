import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: (exception as Error).message };

    const message = typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as any).message || exceptionResponse
        : exceptionResponse;

    if (status >= 500) {
      this.logger.error(`URL: ${request.url} | Error: ${(exception as Error).stack}`);
    } else {
      this.logger.warn(`Validação falhou na URL: ${request.url} | Motivo: ${JSON.stringify(message)}`);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}