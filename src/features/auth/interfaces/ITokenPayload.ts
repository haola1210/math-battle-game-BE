import { Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';

export interface ITokenPayload
  extends Pick<User, 'username' | 'noKilled' | 'noWin'> {
  _id: Types.ObjectId;
}
