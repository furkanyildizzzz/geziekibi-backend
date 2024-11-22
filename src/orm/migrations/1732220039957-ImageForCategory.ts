import { MigrationInterface, QueryRunner } from "typeorm";

export class ImageForCategory1732220039957 implements MigrationInterface {
    name = 'ImageForCategory1732220039957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_3a2d287b78f86659349f85664e4" FOREIGN KEY ("categoryId") REFERENCES "tour_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_3a2d287b78f86659349f85664e4"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "categoryId"`);
    }

}
