import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReceivedUserDTO {
  @ApiProperty({ example: 1, description: 'Unique identifier for the user' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: 'john.doe@chronos.dev', description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password for the user account' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
