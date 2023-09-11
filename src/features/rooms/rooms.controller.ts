import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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
    return await this.roomsServices.getRoomList();
  }

  @WithActiveTokenOnly()
  @Get('/info/:id')
  async getRoomInfo(@Param() { id }: { id: string }) {
    const res = await this.roomsServices.findRoomById(id);

    return res;
  }
}
