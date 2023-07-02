import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import UsersService from '../users/user.service';
import { ITokenPayload } from './interfaces/ITokenPayload';
import { RegisterDTO } from './interfaces/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private ATSecret: string;
  private RTSecret: string;
  private CKPath: string;

  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.ATSecret = this.configService.get('AT_SECRET');
    this.RTSecret = this.configService.get('RT_SECRET');
    this.CKPath = this.configService.get('CK_PATH');
  }

  async verifyToken(token: string, secret: string) {
    try {
      // verify AT
      const decoded = verify(token, secret) as Partial<ITokenPayload>;

      // find user
      const user = await this.usersService.getUserById(decoded._id);
      if (!user) {
        throw new ForbiddenException();
      }

      return user;
      //
    } catch (error) {
      throw error;
    }
  }

  async verifyAccessToken(accessToken: string) {
    try {
      const user = await this.verifyToken(accessToken, this.ATSecret);
      // console.log(user);
      return user;
    } catch (error) {
      console.log(error.message);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException();
      }

      throw error;
    }
  }

  async isTokenExpired(accessToken: string) {
    try {
      // verify AT
      return false;
      //
    } catch (error) {
      if (error && error.name === 'TokenExpiredError') {
        return true;
      }
      throw error;
    }
  }

  async register(registerDTO: RegisterDTO) {
    try {
      return this.usersService.createOneUser(registerDTO);
    } catch (error) {
      throw error;
    }
  }
}
