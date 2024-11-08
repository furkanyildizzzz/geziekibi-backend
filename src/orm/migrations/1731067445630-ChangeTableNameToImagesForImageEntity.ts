import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeTableNameToImagesForImageEntity1731067445630 implements MigrationInterface {
    name = 'ChangeTableNameToImagesForImageEntity1731067445630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "images" (
                "id" SERIAL NOT NULL,
                "public_id" character varying NOT NULL,
                "url" character varying NOT NULL,
                "secure_url" character varying NOT NULL,
                "format" character varying NOT NULL,
                "width" integer NOT NULL,
                "height" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "tour_id" integer,
                "primary_for_tour_id" integer,
                "user_id" integer,
                CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD CONSTRAINT "FK_ca4637e100ebe56837e3642bd65" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD CONSTRAINT "FK_7ca7c357aa6a6ce3103bf0def9e" FOREIGN KEY ("primary_for_tour_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "images"
            ADD CONSTRAINT "FK_decdf86f650fb765dac7bd091a6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "images" DROP CONSTRAINT "FK_decdf86f650fb765dac7bd091a6"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP CONSTRAINT "FK_7ca7c357aa6a6ce3103bf0def9e"
        `);
        await queryRunner.query(`
            ALTER TABLE "images" DROP CONSTRAINT "FK_ca4637e100ebe56837e3642bd65"
        `);
        await queryRunner.query(`
            DROP TABLE "images"
        `);
    }

}
