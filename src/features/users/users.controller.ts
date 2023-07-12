import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { WithActiveTokenOnly } from '../auth/decorators/token-meta.decorator';
import { IAttachedUserRequest } from '../auth/interfaces/IAttachedUserRequest';
import { ResponsedUser } from './serialized-entities/ResponsedUser';
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

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  @WithActiveTokenOnly()
  async myInfor(@Req() req: IAttachedUserRequest) {
    return new ResponsedUser(req.user);
  }
}
