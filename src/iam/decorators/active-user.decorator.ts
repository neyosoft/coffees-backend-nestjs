import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AUTH_USER } from 'src/iam/iam.constants';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const activeUser: ActiveUserData = request[AUTH_USER];

    return field ? activeUser?.[field] : activeUser;
  },
);
