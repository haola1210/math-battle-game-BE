import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  WithExpiredTokenOnly,
  WithoutTokenOnly,
} from './decorators/token-meta.decorator';
import { AuthGuard } from './guards/auth.guard';
import { LoginDTO } from './interfaces/login.dto';
import { RegisterDTO } from './interfaces/register.dto';

@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @WithoutTokenOnly()
  @Post(`register`)
  async register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }

  @WithoutTokenOnly()
  @Post(`login`)
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDTO, res);
  }

  @WithExpiredTokenOnly()
  @Get('refresh-token')
  async refreshToken(@Req() req: Request) {
    return this.authService.processRefreshToken(req);
  }
}
