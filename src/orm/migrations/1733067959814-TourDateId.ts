import { MigrationInterface, QueryRunner } from "typeorm";

export class TourDateId1733067959814 implements MigrationInterface {
    name = 'TourDateId1733067959814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" RENAME COLUMN "tourId" TO "tourDateId"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD CONSTRAINT "FK_4262021ffc6f5bbc97f014d63e1" FOREIGN KEY ("tourDateId") REFERENCES "tourDates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_4262021ffc6f5bbc97f014d63e1"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" RENAME COLUMN "tourDateId" TO "tourId"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8" FOREIGN KEY ("tourId") REFERENCES "tourDates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
