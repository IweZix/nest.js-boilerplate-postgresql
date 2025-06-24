import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class ReceivedUserDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
