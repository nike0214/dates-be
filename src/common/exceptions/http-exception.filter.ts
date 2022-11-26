import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const stack = exception.stack;

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    // TODO: message 변경 필요. getResponse()후에 message 부분 파싱 검토
    const response = {
      code: -1,
      message: (exception as HttpException).message,
    };
    const log = {
      timestamp: new Date(),
      url: req.url,
      response: (exception as HttpException).getResponse(),
      stack,
    };

    if ((exception as HttpException).getStatus() === 404) {
      res.status(404).json();
    } else {
      Logger.error(log);
      res.status((exception as HttpException).getStatus()).json(response);
    }
  }
}
