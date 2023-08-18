import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from 'src/schemas/room.shema';
import { ResponsedUser } from '../users/serialized-entities/ResponsedUser';
import UsersService from '../users/users.service';
import { IRoom } from './interfaces/IRoomList';

@Injectable()
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
    return data;
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
