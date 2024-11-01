import {MigrationInterface, QueryRunner} from "typeorm";

export class ToursTableTitleAndSpotNotNull1730289458027 implements MigrationInterface {
    name = 'ToursTableTitleAndSpotNotNull1730289458027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours" DROP CONSTRAINT "FK_facd344449ad26f464e9681c0ab"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags" DROP CONSTRAINT "FK_14d32753621c875f03d6f32d97b"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "type"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "category_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "spot" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "category" character varying NOT NULL DEFAULT 'YURTICI'
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags"
            ADD CONSTRAINT "FK_14d32753621c875f03d6f32d97b" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags" DROP CONSTRAINT "FK_14d32753621c875f03d6f32d97b"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "category"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "spot"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "category_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "type" character varying NOT NULL DEFAULT 'YURTICI'
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags"
            ADD CONSTRAINT "FK_14d32753621c875f03d6f32d97b" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD CONSTRAINT "FK_facd344449ad26f464e9681c0ab" FOREIGN KEY ("category_id") REFERENCES "tour_categories"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }

}
