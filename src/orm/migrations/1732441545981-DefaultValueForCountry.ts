import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultValueForCountry1732441545981 implements MigrationInterface {
    name = 'DefaultValueForCountry1732441545981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "country" SET DEFAULT 'Türkiye'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "country" SET DEFAULT 'TURKEY'`);
    }

}
