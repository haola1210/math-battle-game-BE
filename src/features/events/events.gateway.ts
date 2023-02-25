import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { BULLET_ACTION } from './events.enum';
import { BulletFlyingDTO } from './events.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

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
}
