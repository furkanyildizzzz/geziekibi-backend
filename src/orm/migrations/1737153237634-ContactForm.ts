import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContactForm1737153237634 implements MigrationInterface {
  name = 'ContactForm1737153237634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contact_form" ADD "is_responded" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "contact_form" ADD "response" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contact_form" DROP COLUMN "response"`);
    await queryRunner.query(`ALTER TABLE "contact_form" DROP COLUMN "is_responded"`);
  }
}
