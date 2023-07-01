import { Controller, Get, Post } from '@nestjs/common';
import UsersService from './user.service';

@Controller('users')
export default class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('redis-test-data')
  async getRedisTestData() {
    return (await this.usersService.testRedis('GET')) || 'nothing yet';
  }

  @Post('redis-test-data')
  setRedisTestData() {
    return this.usersService.testRedis('SET');
  }
}
