import {MigrationInterface, QueryRunner} from "typeorm";

export class ManyToMantTourAndTourPrice1731007687027 implements MigrationInterface {
    name = 'ManyToMantTourAndTourPrice1731007687027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_651d6613f928ea20447011f04df"
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_prices" DROP COLUMN "tour_id"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tour_prices"
            ADD "tour_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_prices"
            ADD CONSTRAINT "FK_651d6613f928ea20447011f04df" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
