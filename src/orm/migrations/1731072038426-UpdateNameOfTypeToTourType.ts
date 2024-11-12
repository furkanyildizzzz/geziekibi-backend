import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateNameOfTypeToTourType1731072038426 implements MigrationInterface {
    name = 'UpdateNameOfTypeToTourType1731072038426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours"
                RENAME COLUMN "type" TO "tour_type"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."tours_type_enum"
            RENAME TO "tours_tour_type_enum"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TYPE "public"."tours_tour_type_enum"
            RENAME TO "tours_type_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
                RENAME COLUMN "tour_type" TO "type"
        `);
    }

}
