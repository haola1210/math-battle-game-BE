import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ResponsedUser } from 'src/features/users/serialized-entities/ResponsedUser';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop({
    unique: true,
  })
  owner: ResponsedUser;

  @Prop({ required: true, maxlength: 8 })
  room_name: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
