import { MigrationInterface, QueryRunner } from "typeorm";

export class  ındexingDailyForm1734262776538 implements MigrationInterface {
    name = ' ındexingDailyForm1734262776538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_82416fd445d5a7e8c1d122542f" ON "tourDailyVisitingPlaces" ("tour_daily_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_be153cbdfef533f331b0571b60" ON "tourDaily" ("tour_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_be153cbdfef533f331b0571b60"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_82416fd445d5a7e8c1d122542f"`);
    }

}
