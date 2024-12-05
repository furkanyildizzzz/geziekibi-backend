import { MigrationInterface, QueryRunner } from "typeorm";

export class TourDateRevision1733335166287 implements MigrationInterface {
    name = 'TourDateRevision1733335166287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tourDates" DROP COLUMN "tour_date"`);
        await queryRunner.query(`ALTER TABLE "tourDates" ADD "start_date" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tourDates" ADD "end_date" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tourDates" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "tourDates" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "tourDates" ADD "tour_date" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
