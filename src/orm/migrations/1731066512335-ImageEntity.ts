import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageEntity1731066512335 implements MigrationInterface {
    name = 'ImageEntity1731066512335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "image" (
                "id" SERIAL NOT NULL,
                "public_id" character varying NOT NULL,
                "url" character varying NOT NULL,
                "secure_url" character varying NOT NULL,
                "format" character varying NOT NULL,
                "width" integer NOT NULL,
                "height" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "tour_id" integer,
                "tours_id" integer,
                "user_id" integer,
                CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "primary_image_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "image"
            ADD CONSTRAINT "FK_6b75c9f92154c333225dd8b21dc" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "image"
            ADD CONSTRAINT "FK_d41e45d14f822287ee8c3a9f0dc" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "image"
            ADD CONSTRAINT "FK_b0b068a2be3e9a2ed6052786781" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD CONSTRAINT "FK_97a70a7b056e774729630968576" FOREIGN KEY ("primary_image_id") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours" DROP CONSTRAINT "FK_97a70a7b056e774729630968576"
        `);
        await queryRunner.query(`
            ALTER TABLE "image" DROP CONSTRAINT "FK_b0b068a2be3e9a2ed6052786781"
        `);
        await queryRunner.query(`
            ALTER TABLE "image" DROP CONSTRAINT "FK_d41e45d14f822287ee8c3a9f0dc"
        `);
        await queryRunner.query(`
            ALTER TABLE "image" DROP CONSTRAINT "FK_6b75c9f92154c333225dd8b21dc"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "primary_image_id"
        `);
        await queryRunner.query(`
            DROP TABLE "image"
        `);
    }

}
