import { ResponsedUser } from 'src/features/users/serialized-entities/ResponsedUser';

export interface IRoom {
  _id: string;
  owner: ResponsedUser;
  room_name: string;
  users: ResponsedUser[];
}
