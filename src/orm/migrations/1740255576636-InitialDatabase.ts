import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1740255576636 implements MigrationInterface {
    name = 'InitialDatabase1740255576636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."static_pages_page_type_enum" RENAME TO "static_pages_page_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."static_pages_page_type_enum" AS ENUM('page-about-us', 'page-secret-policy', 'page-usage-policy', 'page-information-security-policy', 'page-kvkk-policy', 'page-cookie-policy', 'page-membership-agreement-policy', 'page-human-resources', 'tour-packet-agreement')`);
        await queryRunner.query(`ALTER TABLE "static_pages" ALTER COLUMN "page_type" TYPE "public"."static_pages_page_type_enum" USING "page_type"::"text"::"public"."static_pages_page_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."static_pages_page_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."static_pages_page_type_enum_old" AS ENUM('page-about-us', 'page-secret-policy', 'page-usage-policy', 'page-information-security-policy', 'page-kvkk-policy', 'page-cookie-policy', 'page-membership-agreement-policy', 'page-human-resources')`);
        await queryRunner.query(`ALTER TABLE "static_pages" ALTER COLUMN "page_type" TYPE "public"."static_pages_page_type_enum_old" USING "page_type"::"text"::"public"."static_pages_page_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."static_pages_page_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."static_pages_page_type_enum_old" RENAME TO "static_pages_page_type_enum"`);
    }

}
