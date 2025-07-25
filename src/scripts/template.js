function getEntityContent(finaleModuleName) {
  return `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ${finaleModuleName} {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exampleField: string;
}
`;
}

function getReceivedDtoContent(finaleModuleName) {
  return `import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Received${finaleModuleName}Dto {
  @ApiProperty({ example: 'exampleValue', description: 'exampleValue' })
  exampleField: string;
}
`;
}

function getReturnedDtoContent(finaleModuleName) {
  return `import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Returned${finaleModuleName}Dto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the ${finaleModuleName}' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'exampleValue', description: 'exampleValue' })
  exampleField: string;
}
`;
}

module.exports = {
  getEntityContent,
  getReceivedDtoContent,
  getReturnedDtoContent,
};
