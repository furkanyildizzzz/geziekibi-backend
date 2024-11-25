import { MigrationInterface, QueryRunner } from "typeorm";

export class TourPath1732538086039 implements MigrationInterface {
    name = 'TourPath1732538086039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tourPaths" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_eb9c5d679d5dc34def6f7b4a591" UNIQUE ("name"), CONSTRAINT "PK_aa05855c2895a270a64119e3c4d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tourPaths"`);
    }

}
