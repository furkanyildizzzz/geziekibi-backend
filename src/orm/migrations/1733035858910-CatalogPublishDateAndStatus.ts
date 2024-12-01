import { MigrationInterface, QueryRunner } from "typeorm";

export class CatalogPublishDateAndStatus1733035858910 implements MigrationInterface {
    name = 'CatalogPublishDateAndStatus1733035858910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."catalogs_publish_status_enum" AS ENUM('publish', 'draft', 'unpublish')`);
        await queryRunner.query(`ALTER TABLE "catalogs" ADD "publish_status" "public"."catalogs_publish_status_enum" NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "catalogs" ADD "publish_date" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalogs" DROP COLUMN "publish_date"`);
        await queryRunner.query(`ALTER TABLE "catalogs" DROP COLUMN "publish_status"`);
        await queryRunner.query(`DROP TYPE "public"."catalogs_publish_status_enum"`);
    }

}
