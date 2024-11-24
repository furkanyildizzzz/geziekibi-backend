import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableColumnsUserAddress1732436073744 implements MigrationInterface {
    name = 'NullableColumnsUserAddress1732436073744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "secondEmail" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userAddress" DROP CONSTRAINT "UQ_7f1d62962565a6c680274d28c4b"`);
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "website" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "zipCode" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "country" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "zipCode" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "website" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userAddress" ADD CONSTRAINT "UQ_7f1d62962565a6c680274d28c4b" UNIQUE ("secondEmail")`);
        await queryRunner.query(`ALTER TABLE "userAddress" ALTER COLUMN "secondEmail" SET NOT NULL`);
    }

}
