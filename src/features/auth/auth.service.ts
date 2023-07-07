import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import UsersService from '../users/user.service';
import { ITokenPayload } from './interfaces/ITokenPayload';
import { RegisterDTO } from './interfaces/register.dto';
import { LoginDTO } from './interfaces/login.dto';
import generateToken from './utils';
import { Response } from 'express';

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

  async generaTokens(data: ITokenPayload) {
    try {
      const [AT, RT] = await Promise.all([
        generateToken(data, this.ATSecret, { expiresIn: '5m' }),
        generateToken({ _id: data._id }, this.RTSecret, { expiresIn: '7d' }),
      ]);

      return {
        accessToken: AT,
        refreshToken: RT,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  storeRefreshToken(res: Response, refreshToken: string) {
    res.cookie('rt', refreshToken, {
      sameSite: 'none',
      signed: true,
      httpOnly: true,
      secure: true,
      path: this.CKPath,
    });
  }

  async register(registerDTO: RegisterDTO) {
    try {
      return this.usersService.createOneUser(registerDTO);
    } catch (error) {
      throw error;
    }
  }

  async login(loginDTO: LoginDTO, res: Response) {
    try {
      const user = await this.usersService.findAndVerify(loginDTO);
      const { accessToken, refreshToken } = await this.generaTokens({
        _id: user._id,
        username: user.username,
      });

      this.storeRefreshToken(res, refreshToken);

      return { accessToken };
    } catch (error) {
      throw error;
    }
  }
}
