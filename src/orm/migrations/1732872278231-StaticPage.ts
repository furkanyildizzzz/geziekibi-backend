import { MigrationInterface, QueryRunner } from "typeorm";

export class StaticPage1732872278231 implements MigrationInterface {
    name = 'StaticPage1732872278231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."staticPages_page_type_enum" AS ENUM('page-about-us', 'page-secret-policy', 'page-usage-policy', 'paage-information-security-policy', 'page-kvkk-policy', 'page-cookie-policy', 'page-membership-agreement-policy', 'page-human-resources')`);
        await queryRunner.query(`CREATE TABLE "staticPages" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "body" text NOT NULL, "page_type" "public"."staticPages_page_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_57201285e2dae241e0577b82246" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "staticPages"`);
        await queryRunner.query(`DROP TYPE "public"."staticPages_page_type_enum"`);
    }

}
