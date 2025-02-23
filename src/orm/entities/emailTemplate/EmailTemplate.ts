import { EmailTemplateEnum } from 'shared/utils/enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../BaseEntity';

@Entity({ name: 'email_templates' })
export class EmailTemplate extends BaseEntity {
  @Column({ type: 'enum', enum: EmailTemplateEnum, unique: true })
  key: EmailTemplateEnum;

  @Column('text')
  subject: string;

  @Column('text')
  body: string;
}
