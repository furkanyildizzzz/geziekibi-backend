import { MigrationInterface, QueryRunner } from "typeorm";

export class SeoLink1733384700299 implements MigrationInterface {
    name = 'SeoLink1733384700299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "seo_link" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "UQ_a13a34966f7e173d43c35cdeab2" UNIQUE ("seo_link")`);
        await queryRunner.query(`ALTER TABLE "tour_categories" ADD "seo_link" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tour_categories" ADD CONSTRAINT "UQ_3e33c16c9d5630f1c7d15a7e9b5" UNIQUE ("seo_link")`);
        await queryRunner.query(`ALTER TABLE "tours" ADD "seo_link" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tours" ADD CONSTRAINT "UQ_4938efc67fe53f87d7e128ef588" UNIQUE ("seo_link")`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD "seo_link" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "UQ_5e1b7a74e04a2027cd3fde2bccd" UNIQUE ("seo_link")`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "seo_link" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD CONSTRAINT "UQ_21232c6c8d6c2cca3bf240d0c36" UNIQUE ("seo_link")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "seo_link" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_31317eb20428776352681c1d711" UNIQUE ("seo_link")`);
        await queryRunner.query(`ALTER TABLE "catalogs" ADD "seo_link" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "catalogs" ADD CONSTRAINT "UQ_b0cd65fb685447054c178e7f137" UNIQUE ("seo_link")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalogs" DROP CONSTRAINT "UQ_b0cd65fb685447054c178e7f137"`);
        await queryRunner.query(`ALTER TABLE "catalogs" DROP COLUMN "seo_link"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_31317eb20428776352681c1d711"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "seo_link"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP CONSTRAINT "UQ_21232c6c8d6c2cca3bf240d0c36"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "seo_link"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "UQ_5e1b7a74e04a2027cd3fde2bccd"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "seo_link"`);
        await queryRunner.query(`ALTER TABLE "tours" DROP CONSTRAINT "UQ_4938efc67fe53f87d7e128ef588"`);
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "seo_link"`);
        await queryRunner.query(`ALTER TABLE "tour_categories" DROP CONSTRAINT "UQ_3e33c16c9d5630f1c7d15a7e9b5"`);
        await queryRunner.query(`ALTER TABLE "tour_categories" DROP COLUMN "seo_link"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "UQ_a13a34966f7e173d43c35cdeab2"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "seo_link"`);
    }

}
