import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  username: 'text',
});
