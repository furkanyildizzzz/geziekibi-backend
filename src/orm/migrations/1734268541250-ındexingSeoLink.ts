import { MigrationInterface, QueryRunner } from "typeorm";

export class  ındexingSeoLink1734268541250 implements MigrationInterface {
    name = ' ındexingSeoLink1734268541250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_4938efc67fe53f87d7e128ef58" ON "tours" ("seo_link") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4938efc67fe53f87d7e128ef58"`);
    }

}
