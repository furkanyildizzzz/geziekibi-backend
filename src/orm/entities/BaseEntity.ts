import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({ name: 'insert_date' })
  insertDate: Date;

  @Column({ name: 'insert_user_id', nullable: true })
  insertUserId: number;

  @UpdateDateColumn({ name: 'update_date' })
  updateDate: Date;

  @Column({ name: 'update_user_id', nullable: true })
  updateUserId: number;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;
}
