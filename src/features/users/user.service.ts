import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export default class UsersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  testRedis(type: 'GET' | 'SET') {
    if (type === 'GET') {
      return this.cacheManager.get('data');
    }
    this.cacheManager.set('data', 'set data to redis ok');
  }
}
