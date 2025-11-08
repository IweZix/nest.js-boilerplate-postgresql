import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDTO {
  @ApiProperty({ example: 'john.doe@chronos.dev' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password1234', description: 'Password for the user account' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
