import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeColumnNamesOfImage1731150432697 implements MigrationInterface {
    name = 'ChangeColumnNamesOfImage1731150432697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "images" DROP CONSTRAINT "FK_ca4637e100ebe56837e3642bd65"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP CONSTRAINT "FK_7ca7c357aa6a6ce3103bf0def9e"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP CONSTRAINT "FK_decdf86f650fb765dac7bd091a6"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "tour_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "primary_for_tour_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "public_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "secure_url"
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "publicId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "secureUrl" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "order" integer NOT NULL DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "tourId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "primaryForTourId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "userId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD CONSTRAINT "FK_f15800a81ae8f332420a6d5b8ba" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD CONSTRAINT "FK_fb4f0028b816901df73c2defa8e" FOREIGN KEY ("primaryForTourId") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD CONSTRAINT "FK_96514329909c945f10974aff5f8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "images" DROP CONSTRAINT "FK_96514329909c945f10974aff5f8"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP CONSTRAINT "FK_fb4f0028b816901df73c2defa8e"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP CONSTRAINT "FK_f15800a81ae8f332420a6d5b8ba"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "userId"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "primaryForTourId"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "tourId"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "createdAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "order"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "secureUrl"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP COLUMN "publicId"
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "secure_url" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "public_id" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "user_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "primary_for_tour_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "tour_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD CONSTRAINT "FK_decdf86f650fb765dac7bd091a6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD CONSTRAINT "FK_7ca7c357aa6a6ce3103bf0def9e" FOREIGN KEY ("primary_for_tour_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD CONSTRAINT "FK_ca4637e100ebe56837e3642bd65" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
