import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOriginalNameColumnToImageTable1732101792832 implements MigrationInterface {
    name = 'AddOriginalNameColumnToImageTable1732101792832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" ADD "originalName" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."tour_services_type_enum" RENAME TO "tour_services_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."tour_services_type_enum" AS ENUM('included', 'inherit', 'excluded')`);
        await queryRunner.query(`ALTER TABLE "tour_services" ALTER COLUMN "type" TYPE "public"."tour_services_type_enum" USING "type"::"text"::"public"."tour_services_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tour_services_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tour_services_type_enum_old" AS ENUM('included', 'excluded')`);
        await queryRunner.query(`ALTER TABLE "tour_services" ALTER COLUMN "type" TYPE "public"."tour_services_type_enum_old" USING "type"::"text"::"public"."tour_services_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."tour_services_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."tour_services_type_enum_old" RENAME TO "tour_services_type_enum"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "originalName"`);
    }

}
