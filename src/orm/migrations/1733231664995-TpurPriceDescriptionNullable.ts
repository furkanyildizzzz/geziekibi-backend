import { MigrationInterface, QueryRunner } from "typeorm";

export class TpurPriceDescriptionNullable1733231664995 implements MigrationInterface {
    name = 'TpurPriceDescriptionNullable1733231664995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tourDailyVisitingPlaces" DROP CONSTRAINT "FK_82416fd445d5a7e8c1d122542fe"`);
        await queryRunner.query(`ALTER TABLE "tourDailyVisitingPlaces" ADD CONSTRAINT "FK_82416fd445d5a7e8c1d122542fe" FOREIGN KEY ("tour_daily_id") REFERENCES "tourDaily"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tourDailyVisitingPlaces" DROP CONSTRAINT "FK_82416fd445d5a7e8c1d122542fe"`);
        await queryRunner.query(`ALTER TABLE "tourDailyVisitingPlaces" ADD CONSTRAINT "FK_82416fd445d5a7e8c1d122542fe" FOREIGN KEY ("tour_daily_id") REFERENCES "tourDaily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
