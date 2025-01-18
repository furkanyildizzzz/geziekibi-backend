import { Entity, PrimaryGeneratedColumn, Column, IsNull } from 'typeorm';
import { Length, IsEmail, Matches, IsOptional, IsBoolean } from 'class-validator';

@Entity('contact_form')
export class ContactForm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  @Length(1, 50, { message: 'Zorunlu Alan' })
  firstName: string;

  @Column({ length: 50 })
  @Length(1, 50, { message: 'Zorunlu Alan' })
  lastName: string;

  @Column()
  @IsEmail({}, { message: 'Geçersiz email adresi' })
  email: string;

  @Column({ nullable: true })
  @IsOptional()
  @Matches(/^[0-9+\-\s]*$/, { message: 'Geçersiz telefon numarası' })
  phone?: string;

  @Column({ type: 'text' })
  @Length(10, 1000, {
    message: 'Mesajınız en az 10 karakter ve en fazla 1000 karakter içermelidir.',
  })
  @Matches(/^(?!.*(script|<|>|&|{|})).*$/i, {
    message: 'Mesajınızda zararlı içerik bulunmaktadır.',
  })
  message: string;

  @Column()
  @IsBoolean({ message: 'Gizlilik politikasını onaylayınız.' })
  agreeToTerms: boolean;

  @Column({ default: false })
  isResponded: boolean;

  @Column({ type: 'text' })
  @Length(10, 1000, {
    message: 'Mesajınız en az 10 karakter ve en fazla 1000 karakter içermelidir.',
  })
  @Matches(/^(?!.*(script|<|>|&|{|})).*$/i, {
    message: 'Mesajınızda zararlı içerik bulunmaktadır.',
  })
  response?: string;
}
