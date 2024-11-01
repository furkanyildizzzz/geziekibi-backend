import {MigrationInterface, QueryRunner} from "typeorm";

export class TourCategory1730184811565 implements MigrationInterface {
    name = 'TourCategory1730184811565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags" DROP CONSTRAINT "FK_14d32753621c875f03d6f32d97b"
        `);
        await queryRunner.query(`
            CREATE TABLE "tour_categories" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" text NOT NULL,
                "parent_id" integer,
                CONSTRAINT "PK_18a856b2d2c6b1e8dd0d608602c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "category"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "type" character varying NOT NULL DEFAULT 'YURTICI'
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "category_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_categories"
            ADD CONSTRAINT "FK_cd7e7a6b10e1153452fae70d093" FOREIGN KEY ("parent_id") REFERENCES "tour_categories"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD CONSTRAINT "FK_facd344449ad26f464e9681c0ab" FOREIGN KEY ("category_id") REFERENCES "tour_categories"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags"
            ADD CONSTRAINT "FK_14d32753621c875f03d6f32d97b" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags" DROP CONSTRAINT "FK_14d32753621c875f03d6f32d97b"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP CONSTRAINT "FK_facd344449ad26f464e9681c0ab"
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_categories" DROP CONSTRAINT "FK_cd7e7a6b10e1153452fae70d093"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "category_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "type"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "category" character varying NOT NULL DEFAULT 'YURTICI'
        `);
        await queryRunner.query(`
            DROP TABLE "tour_categories"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags"
            ADD CONSTRAINT "FK_14d32753621c875f03d6f32d97b" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

}
