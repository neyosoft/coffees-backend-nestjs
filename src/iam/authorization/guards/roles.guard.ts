import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/user/enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { AUTH_USER } from 'src/iam/iam.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!contextRole) return true;

    const request = context.switchToHttp().getRequest();

    const user: ActiveUserData = request[AUTH_USER];

    return contextRole.some((role) => user.role === role);
  }
}
