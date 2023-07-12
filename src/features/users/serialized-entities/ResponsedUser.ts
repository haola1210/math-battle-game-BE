import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';
import { UserDocument } from 'src/schemas/user.schema';

export class ResponsedUser {
  _id: Types.ObjectId;

  name: string;

  username: string;

  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<ResponsedUser>) {
    Object.assign(this, partial);
  }
}
