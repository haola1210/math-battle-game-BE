import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { WithoutTokenOnly } from './decorators/token-meta.decorator';
import { AuthGuard } from './guards/auth.guard';
import { LoginDTO } from './interfaces/login.dto';
import { RegisterDTO } from './interfaces/register.dto';

@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authSerivce: AuthService) {}

  @WithoutTokenOnly()
  @Post(`register`)
  async register(@Body() registerDTO: RegisterDTO) {
    return this.authSerivce.register(registerDTO);
  }

  @WithoutTokenOnly()
  @Post(`login`)
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authSerivce.login(loginDTO, res);
  }
}
