import {MigrationInterface, QueryRunner} from "typeorm";

export class RelationBTWImageEntityAndTourPrimaryImage1731067398656 implements MigrationInterface {
    name = 'RelationBTWImageEntityAndTourPrimaryImage1731067398656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "image" DROP CONSTRAINT "FK_d41e45d14f822287ee8c3a9f0dc"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP CONSTRAINT "FK_97a70a7b056e774729630968576"
        `);
        await queryRunner.query(`
            ALTER TABLE "image"
                RENAME COLUMN "tours_id" TO "primary_for_tour_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "primary_image_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "image"
            ADD CONSTRAINT "FK_7dd77c7277e6fdadcc529386748" FOREIGN KEY ("primary_for_tour_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "image" DROP CONSTRAINT "FK_7dd77c7277e6fdadcc529386748"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "primary_image_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "image"
                RENAME COLUMN "primary_for_tour_id" TO "tours_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD CONSTRAINT "FK_97a70a7b056e774729630968576" FOREIGN KEY ("primary_image_id") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "image"
            ADD CONSTRAINT "FK_d41e45d14f822287ee8c3a9f0dc" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
