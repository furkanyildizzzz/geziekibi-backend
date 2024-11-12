import {MigrationInterface, QueryRunner} from "typeorm";

export class AddStartDateEndDateColumns1731141507990 implements MigrationInterface {
    name = 'AddStartDateEndDateColumns1731141507990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "start_date" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "end_date" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "end_date"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "start_date"
        `);
    }

}
