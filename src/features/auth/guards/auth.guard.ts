import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { AUTH_META, AUTH_TOKEN_META } from '../interfaces/auth.enum';
import { IAttachedUserRequest } from '../interfaces/IAttachedUserRequest';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  getAccessToken(request: Request) {
    try {
      const authorizationHeader: string = request.headers['authorization'];
      if (!authorizationHeader) {
        throw new Error();
      }

      const accessToken = authorizationHeader.split(' ')[1];

      if (accessToken) {
        throw new Error();
      }
      return accessToken;
    } catch (error) {
      return undefined;
    }
  }

  async canActivate(context: ExecutionContext) {
    const handler = context.getHandler();
    const controller = context.getClass();
    const handlerOverrideController =
      this.reflector.getAllAndOverride(AUTH_META.TOKEN_META, [
        handler,
        controller,
      ]) ?? AUTH_TOKEN_META.PUBLIC;
    switch (handlerOverrideController) {
      //#region
      case AUTH_TOKEN_META.PUBLIC: {
        return true;
      }
      //#endregion

      //#region
      case AUTH_TOKEN_META.WITH_ACTIVE_TOKEN_ONLY: {
        try {
          const request = context.switchToHttp().getRequest();

          const AT = this.getAccessToken(request);
          if (AT === undefined) {
            throw new ForbiddenException();
          }
          const user = await this.authService.verifyAccessToken(AT);

          (request as IAttachedUserRequest).user = user;
          return true;
          //
        } catch (error) {
          if (error instanceof UnauthorizedException) {
            throw new UnauthorizedException();
          }
          return false;
        }
      }
      //#endregion

      //#region
      case AUTH_TOKEN_META.WITH_EXPIRED_TOKEN_ONLY: {
        try {
          const request = context.switchToHttp().getRequest();

          const AT = this.getAccessToken(request);
          if (AT === undefined) {
            throw new Error();
          }

          return this.authService.isTokenExpired(AT);
          //
        } catch (error) {
          return false;
        }
      }
      //#endregion

      //#region
      case AUTH_TOKEN_META.WITHOUT_TOKEN_ONLY: {
        try {
          const request: Request = context.switchToHttp().getRequest();
          //
          console.log('zo day');

          const authorizationHeader: string = request.headers['authorization'];
          if (authorizationHeader) {
            throw new Error();
          }

          return true;
          //
        } catch (error) {
          return false;
        }
      }
      //#endregion
    }
    //
    return false;
  }
}
