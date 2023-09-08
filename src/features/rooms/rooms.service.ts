import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from 'src/schemas/room.shema';
import { ResponsedUser } from '../users/serialized-entities/ResponsedUser';
import UsersService from '../users/users.service';
import { IRoom } from './interfaces/IRoomList';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    private userService: UsersService,
  ) {}

  async createRoom(owner: ResponsedUser, room_name: string) {
    const newRoom = {
      owner: owner,
      room_name,
    };
    const data = await this.roomModel.create(newRoom);
    const res = { ...data['_doc'], users: [owner] };
    return res;
  }

  async findRoomById(id: Types.ObjectId | string) {
    const res = await this.roomModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'room_id',
          as: 'users',
        },
      },
      {
        $project: {
          'users.password': 0,
        },
      },
    ]);

    return res[0] as unknown as IRoom;
  }

  async getRoomList() {
    const roomList = await this.roomModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'room_id',
          as: 'users',
        },
      },
      {
        $project: {
          'users.password': 0,
        },
      },
    ]);

    return roomList as unknown as IRoom[];
  }
}
