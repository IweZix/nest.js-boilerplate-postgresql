import { CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({ name: 'createdAt' })
  createdAt?: Date;

  @Column({ name: 'createdBy', nullable: true })
  createdBy?: string;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt?: Date;

  @Column({ name: 'updatedBy', nullable: true })
  updatedBy?: string;
}
