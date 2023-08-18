import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WithActiveTokenOnly } from '../auth/decorators/token-meta.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoomsService } from './rooms.service';

@UseGuards(AuthGuard)
@Controller('/rooms')
export class RoomsController {
  constructor(private roomsServices: RoomsService) {}

  @WithActiveTokenOnly()
  @Get('/list')
  async getRoomList() {
    console.log(await this.roomsServices.getRoomList());
    return await this.roomsServices.getRoomList();
  }
}
