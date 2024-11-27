import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeBreakFastColumnName1732626473436 implements MigrationInterface {
    name = 'ChangeBreakFastColumnName1732626473436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tourDaily" RENAME COLUMN "breakfast" TO "breakfeast"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tourDaily" RENAME COLUMN "breakfeast" TO "breakfast"`);
    }

}
