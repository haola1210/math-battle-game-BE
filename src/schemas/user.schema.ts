import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TEAM_ENUM } from 'src/consts/team.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
    length: [6, 20],
    trim: true,
    lowercase: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 8,
  })
  password: string;

  @Prop({})
  noWin: number;

  @Prop({})
  noKilled: number;

  @Prop()
  room_id: Types.ObjectId;

  @Prop({})
  team: TEAM_ENUM;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  username: 'text',
});
