import { Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';

export interface ITokenPayload extends Pick<User, 'username'> {
  _id: Types.ObjectId;
}
