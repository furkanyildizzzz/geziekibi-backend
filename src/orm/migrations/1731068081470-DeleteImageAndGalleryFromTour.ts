import {MigrationInterface, QueryRunner} from "typeorm";

export class DeleteImageAndGalleryFromTour1731068081470 implements MigrationInterface {
    name = 'DeleteImageAndGalleryFromTour1731068081470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "image"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "gallery"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "gallery" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "image" character varying NOT NULL
        `);
    }

}
