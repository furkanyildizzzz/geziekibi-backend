import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTableNames1732607710222 implements MigrationInterface {
    name = 'ChangeTableNames1732607710222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tourDailyPaths" DROP CONSTRAINT "FK_0b182fffa4b589b9b82bbba3b84"`);
        await queryRunner.query(`CREATE TABLE "tourDailyVisitingPlaces" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "tour_daily_id" integer, CONSTRAINT "PK_354d79353abc5b6af2530b106e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tour_daily_daily_paths_tour_daily_paths" ("tour_daily_id" integer NOT NULL, "tour_daily_paths_id" integer NOT NULL, CONSTRAINT "PK_1c694552850851c8c4389e10b71" PRIMARY KEY ("tour_daily_id", "tour_daily_paths_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2964cb44fa869f55fcc4606a16" ON "tour_daily_daily_paths_tour_daily_paths" ("tour_daily_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_eda893108bc5a590e2b486fba7" ON "tour_daily_daily_paths_tour_daily_paths" ("tour_daily_paths_id") `);
        await queryRunner.query(`ALTER TABLE "tourDailyPaths" DROP COLUMN "tour_daily_id"`);
        await queryRunner.query(`ALTER TABLE "tourDailyPaths" ADD CONSTRAINT "UQ_2b88e26f5612a94c03497ada655" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "tourDailyVisitingPlaces" ADD CONSTRAINT "FK_82416fd445d5a7e8c1d122542fe" FOREIGN KEY ("tour_daily_id") REFERENCES "tourDaily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_daily_daily_paths_tour_daily_paths" ADD CONSTRAINT "FK_2964cb44fa869f55fcc4606a16f" FOREIGN KEY ("tour_daily_id") REFERENCES "tourDaily"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tour_daily_daily_paths_tour_daily_paths" ADD CONSTRAINT "FK_eda893108bc5a590e2b486fba79" FOREIGN KEY ("tour_daily_paths_id") REFERENCES "tourDailyPaths"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_daily_daily_paths_tour_daily_paths" DROP CONSTRAINT "FK_eda893108bc5a590e2b486fba79"`);
        await queryRunner.query(`ALTER TABLE "tour_daily_daily_paths_tour_daily_paths" DROP CONSTRAINT "FK_2964cb44fa869f55fcc4606a16f"`);
        await queryRunner.query(`ALTER TABLE "tourDailyVisitingPlaces" DROP CONSTRAINT "FK_82416fd445d5a7e8c1d122542fe"`);
        await queryRunner.query(`ALTER TABLE "tourDailyPaths" DROP CONSTRAINT "UQ_2b88e26f5612a94c03497ada655"`);
        await queryRunner.query(`ALTER TABLE "tourDailyPaths" ADD "tour_daily_id" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eda893108bc5a590e2b486fba7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2964cb44fa869f55fcc4606a16"`);
        await queryRunner.query(`DROP TABLE "tour_daily_daily_paths_tour_daily_paths"`);
        await queryRunner.query(`DROP TABLE "tourDailyVisitingPlaces"`);
        await queryRunner.query(`ALTER TABLE "tourDailyPaths" ADD CONSTRAINT "FK_0b182fffa4b589b9b82bbba3b84" FOREIGN KEY ("tour_daily_id") REFERENCES "tourDaily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
