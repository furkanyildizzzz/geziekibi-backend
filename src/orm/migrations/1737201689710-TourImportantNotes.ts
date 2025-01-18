import { MigrationInterface, QueryRunner } from "typeorm";

export class TourImportantNotes1737201689710 implements MigrationInterface {
    name = 'TourImportantNotes1737201689710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tours" ADD "important_notes" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "important_notes"`);
    }

}
