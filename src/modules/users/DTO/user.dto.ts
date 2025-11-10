import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({ example: 1, description: 'Unique identifier for the user' })
  @IsNumber()
  id?: number;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  lastname?: string;

  @ApiProperty({ example: 'john.doe@nest.dev' })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 100, description: 'Role of the user' })
  @IsString()
  role?: string;

  @ApiProperty({ example: 'mySuperToken', description: 'Password for the user account' })
  @IsString()
  token?: string;
}
