import { MigrationInterface, QueryRunner } from "typeorm";

export class CatalogPublishDateAndStatus1733067860154 implements MigrationInterface {
    name = 'CatalogPublishDateAndStatus1733067860154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8"`);
        await queryRunner.query(`CREATE TABLE "tourDates" ("id" SERIAL NOT NULL, "tour_date" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL, "is_active" boolean NOT NULL, "tourId" integer, CONSTRAINT "PK_00175eebc3aa9443919cbe22a71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8" FOREIGN KEY ("tourId") REFERENCES "tourDates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tourDates" ADD CONSTRAINT "FK_26eb53463f1adefc05c85db1e09" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tourDates" DROP CONSTRAINT "FK_26eb53463f1adefc05c85db1e09"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8"`);
        await queryRunner.query(`DROP TABLE "tourDates"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
