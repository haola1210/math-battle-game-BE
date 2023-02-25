import { IsNumber, IsString } from 'class-validator';

export class BulletFlyingDTO {
  @IsNumber()
  x: number;

  @IsString()
  equation: string;
}
