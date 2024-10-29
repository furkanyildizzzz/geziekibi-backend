import {MigrationInterface, QueryRunner} from "typeorm";

export class TourCategoryDescriptionNullable1730198118334 implements MigrationInterface {
    name = 'TourCategoryDescriptionNullable1730198118334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tour_categories"
            ALTER COLUMN "description" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tour_categories"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
    }

}
