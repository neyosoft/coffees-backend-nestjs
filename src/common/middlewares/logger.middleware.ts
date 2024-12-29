import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.time('Request-response time');
    console.log("I'm a middleware");

    res.on('finish', () => console.timeEnd('Request-response time'));

    next();
  }
}
