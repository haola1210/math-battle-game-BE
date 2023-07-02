import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProxyGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const proxied = request.headers['proxied'];

    if (this.config.get('MODE') === 'dev') {
      return true;
    }

    if (proxied === 'nginx') {
      return true;
    }

    return false;
  }
}
