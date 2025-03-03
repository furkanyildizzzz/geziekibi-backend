import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1740965441921 implements MigrationInterface {
    name = 'InitialDatabase1740965441921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STANDARD'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STANDART'`);
    }

}
