import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class BaseDTO {
  @ApiProperty({ example: new Date(), description: 'Creation timestamp' })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiProperty({ example: 'system', description: 'Creator of the entity' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({ example: new Date(), description: 'Last update timestamp' })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @ApiProperty({ example: 'system', description: 'Last updater of the entity' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
