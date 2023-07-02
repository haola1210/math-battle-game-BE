import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WithoutTokenOnly } from './decorators/token-meta.decorator';
import { AuthGuard } from './guards/auth.guard';
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
}
