import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Protocol = createParamDecorator(
  (defalutValue: string, ctx: ExecutionContext) => {
    console.log({ defalutValue });

    const request = ctx.switchToHttp().getRequest();

    return request.protocol;
  },
);
