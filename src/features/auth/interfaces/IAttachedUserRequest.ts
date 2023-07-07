import { Request } from 'express';
import { User } from 'src/schemas/user.schema';

export interface IAttachedUserRequest extends Request {
  user: User;
}
