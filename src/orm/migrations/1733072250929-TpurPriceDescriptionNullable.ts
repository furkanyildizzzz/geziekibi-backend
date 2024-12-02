import { MigrationInterface, QueryRunner } from "typeorm";

export class TpurPriceDescriptionNullable1733072250929 implements MigrationInterface {
    name = 'TpurPriceDescriptionNullable1733072250929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_prices" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tourDates" ALTER COLUMN "is_active" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tourDates" ALTER COLUMN "is_active" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ALTER COLUMN "description" SET NOT NULL`);
    }

}
