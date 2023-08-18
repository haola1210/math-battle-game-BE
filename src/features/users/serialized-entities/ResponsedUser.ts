import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';
import { TEAM_ENUM } from 'src/consts/team.enum';

export class ResponsedUser {
  _id: Types.ObjectId;

  username: string;

  noWin: number;

  noKilled: number;

  room_id: Types.ObjectId;

  team: TEAM_ENUM;

  @Exclude()
  password: string;

  constructor(partial: Partial<ResponsedUser>) {
    Object.assign(this, partial);
  }
}
