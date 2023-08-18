import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RoomsService } from '../rooms/rooms.service';
import { ResponsedUser } from '../users/serialized-entities/ResponsedUser';
import UsersService from '../users/users.service';
import { BulletFlyingDTO } from './events.dto';
import { BULLET_ACTION, USER_ACTION } from './events.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomsService,
    private userService: UsersService,
  ) {}

  @SubscribeMessage(BULLET_ACTION.FLYING)
  bulletFlying(@MessageBody() data: BulletFlyingDTO): WsResponse<unknown> {
    console.log('recieve event: BULLET_ACTION.FLYING', data);
    return {
      event: BULLET_ACTION.SYNC_FLYING,
      data,
    };
  }

  @SubscribeMessage(BULLET_ACTION.STOP)
  bulletStopped(): WsResponse<unknown> {
    console.log('recieve event: BULLET_ACTION.STOP');
    return {
      event: BULLET_ACTION.SYNC_STOP,
      data: undefined,
    };
  }

  @SubscribeMessage(BULLET_ACTION.COLLIDED_OBSTACLE)
  collidedObstacle(@MessageBody() data: BulletFlyingDTO): WsResponse<unknown> {
    console.log('recieve event: BULLET_ACTION.COLLIDED_OBSTACLE');
    return {
      event: BULLET_ACTION.SYNC_COLLIDED_OBSTACLE,
      data,
    };
  }

  @SubscribeMessage(USER_ACTION.CREATE_ROOM)
  async createRoom(
    @MessageBody()
    { user, room_name }: { user: ResponsedUser; room_name: string },
  ) {
    try {
      const room = await this.roomService.createRoom(user, room_name);
      const userUpdated = await this.userService.updateUserRoom(
        user._id,
        room._id,
      );

      const roomList = await this.roomService.getRoomList();

      console.log(roomList);

      if (userUpdated && room) {
        this.server.emit(USER_ACTION.CREATE_ROOM_FEEDBACK, {
          roomList,
          user,
          room,
        });
      }
    } catch (error) {
      return {
        event: USER_ACTION.CREATE_ROOM_ERROR,
        error,
      };
    }
  }
}
