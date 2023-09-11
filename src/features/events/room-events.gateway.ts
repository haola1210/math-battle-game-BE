import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { SOCKET_MESSAGE } from 'src/consts/socket-message.enum';
import { TEAM_ENUM } from 'src/consts/team.enum';
import { RoomsService } from '../rooms/rooms.service';
import { ResponsedUser } from '../users/serialized-entities/ResponsedUser';
import UsersService from '../users/users.service';
import { USER_ACTION } from './events.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomEventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private roomService: RoomsService,
    private userService: UsersService,
  ) {}

  @SubscribeMessage(USER_ACTION.CREATE_ROOM)
  async createRoom(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    { user, room_name }: { user: ResponsedUser; room_name: string },
  ) {
    try {
      const room = await this.roomService.createRoom(user, room_name);
      const userUpdated = await this.userService.updateUserRoom(
        user._id,
        room._id,
        TEAM_ENUM.ONE,
      );

      client.join(room._id.toString());

      if (userUpdated && room) {
        this.server.emit(USER_ACTION.CREATE_ROOM_FEEDBACK, {
          user: userUpdated,
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

  @SubscribeMessage(USER_ACTION.JOIN_ROOM)
  async joinRoom(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    { user_id, room_id }: { user_id: Types.ObjectId; room_id: Types.ObjectId },
  ) {
    try {
      const selectedRoom = await this.roomService.findRoomById(room_id);
      if (selectedRoom) {
        // if length === 4 => room is full
        if (selectedRoom.users.length >= 4) {
          return {
            event: USER_ACTION.CREATE_ROOM_FEEDBACK,
            message: SOCKET_MESSAGE.FULL_ROOM,
          };
        } else {
          // if length < 4, count member of team 1 < 2 => add member to team 1
          //count member of team 1 > 2 => add member to team 2
          const count = selectedRoom.users.filter(
            (item) => item.team === TEAM_ENUM.ONE,
          ).length;

          const userUpdated = await this.userService.updateUserRoom(
            user_id,
            room_id,
            count >= 2 ? TEAM_ENUM.TWO : TEAM_ENUM.ONE,
          );

          const roomAfterUpdated = await this.roomService.findRoomById(
            new Types.ObjectId(selectedRoom._id),
          );

          client.join(room_id.toString());

          this.server
            .to(room_id.toString())
            .emit(USER_ACTION.JOIN_ROOM_FEEDBACK_ROOM, {
              user_joined: userUpdated,
              room: roomAfterUpdated,
              message: SOCKET_MESSAGE.JOIN_ROOM_SUCCESS,
            });

          this.server.emit(USER_ACTION.JOIN_ROOM_FEEDBACK_LOBBY, {
            room: roomAfterUpdated,
            user_joined: userUpdated,
            message: USER_ACTION.USER_JOIN_ROOM,
          });
        }
      }
    } catch (error) {
      return {
        event: USER_ACTION.JOIN_ROOM_ERROR,
        error,
        message: SOCKET_MESSAGE.JOIN_ROOM_ERROR,
      };
    }
  }

  @SubscribeMessage(USER_ACTION.LEAVE_ROOM)
  async leaveRoom(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    { user_id, room_id }: { user_id: Types.ObjectId; room_id: Types.ObjectId },
  ) {
    try {
      const selectedRoom = await this.roomService.findRoomById(room_id);
      if (selectedRoom.users.length === 1) {
        const deletedRoom = await this.roomService.deleteRoom(room_id);
        const updatedUser = await this.userService.updateUserRoom(
          user_id,
          undefined,
          undefined,
        );

        this.server.to(room_id.toString()).emit(USER_ACTION.LEAVE_ROOM_FEEDBACK_ROOM. {updated_user: updatedUser});
        client.leave(room_id.toString());
      }
    } catch (error) {}
  }
}
