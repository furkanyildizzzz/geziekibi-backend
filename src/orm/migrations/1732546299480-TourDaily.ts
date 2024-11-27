import { MigrationInterface, QueryRunner } from "typeorm";

export class TourDaily1732546299480 implements MigrationInterface {
    name = 'TourDaily1732546299480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tourDailyPaths" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "tour_daily_id" integer, CONSTRAINT "PK_de35a01e43359139ad552081b9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tourDaily" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "breakfast" text NOT NULL, "lunch" text NOT NULL, "dinner" text NOT NULL, "description" text NOT NULL, "tour_id" integer, CONSTRAINT "PK_0eab1b6b8b22ad86ada1e4cfc8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tour_daily_tour_paths_tour_paths" ("tour_daily_id" integer NOT NULL, "tour_paths_id" integer NOT NULL, CONSTRAINT "PK_4e98d4c78d1b906a222e4e1418f" PRIMARY KEY ("tour_daily_id", "tour_paths_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_370b842dc66e34b1022a8ea6aa" ON "tour_daily_tour_paths_tour_paths" ("tour_daily_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_cac9b4cc1119667cbd6bfa1867" ON "tour_daily_tour_paths_tour_paths" ("tour_paths_id") `);
        await queryRunner.query(`ALTER TABLE "tourDailyPaths" ADD CONSTRAINT "FK_0b182fffa4b589b9b82bbba3b84" FOREIGN KEY ("tour_daily_id") REFERENCES "tourDaily"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tourDaily" ADD CONSTRAINT "FK_be153cbdfef533f331b0571b604" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_daily_tour_paths_tour_paths" ADD CONSTRAINT "FK_370b842dc66e34b1022a8ea6aa7" FOREIGN KEY ("tour_daily_id") REFERENCES "tourDaily"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tour_daily_tour_paths_tour_paths" ADD CONSTRAINT "FK_cac9b4cc1119667cbd6bfa1867b" FOREIGN KEY ("tour_paths_id") REFERENCES "tourPaths"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_daily_tour_paths_tour_paths" DROP CONSTRAINT "FK_cac9b4cc1119667cbd6bfa1867b"`);
        await queryRunner.query(`ALTER TABLE "tour_daily_tour_paths_tour_paths" DROP CONSTRAINT "FK_370b842dc66e34b1022a8ea6aa7"`);
        await queryRunner.query(`ALTER TABLE "tourDaily" DROP CONSTRAINT "FK_be153cbdfef533f331b0571b604"`);
        await queryRunner.query(`ALTER TABLE "tourDailyPaths" DROP CONSTRAINT "FK_0b182fffa4b589b9b82bbba3b84"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cac9b4cc1119667cbd6bfa1867"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_370b842dc66e34b1022a8ea6aa"`);
        await queryRunner.query(`DROP TABLE "tour_daily_tour_paths_tour_paths"`);
        await queryRunner.query(`DROP TABLE "tourDaily"`);
        await queryRunner.query(`DROP TABLE "tourDailyPaths"`);
    }

}
