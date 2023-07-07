import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsLowercase,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 25)
  @IsLowercase()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(8)
  password: string;
}
