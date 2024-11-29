import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePageTypeEnum1732887294304 implements MigrationInterface {
    name = 'UpdatePageTypeEnum1732887294304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."staticPages_page_type_enum" RENAME TO "staticPages_page_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."staticPages_page_type_enum" AS ENUM('page-about-us', 'page-secret-policy', 'page-usage-policy', 'page-information-security-policy', 'page-kvkk-policy', 'page-cookie-policy', 'page-membership-agreement-policy', 'page-human-resources')`);
        await queryRunner.query(`ALTER TABLE "staticPages" ALTER COLUMN "page_type" TYPE "public"."staticPages_page_type_enum" USING "page_type"::"text"::"public"."staticPages_page_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."staticPages_page_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."staticPages_page_type_enum_old" AS ENUM('page-about-us', 'page-secret-policy', 'page-usage-policy', 'paage-information-security-policy', 'page-kvkk-policy', 'page-cookie-policy', 'page-membership-agreement-policy', 'page-human-resources')`);
        await queryRunner.query(`ALTER TABLE "staticPages" ALTER COLUMN "page_type" TYPE "public"."staticPages_page_type_enum_old" USING "page_type"::"text"::"public"."staticPages_page_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."staticPages_page_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."staticPages_page_type_enum_old" RENAME TO "staticPages_page_type_enum"`);
    }

}
