import {MigrationInterface, QueryRunner} from "typeorm";

export class CascadeOnDelateTags1731007120708 implements MigrationInterface {
    name = 'CascadeOnDelateTags1731007120708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags" DROP CONSTRAINT "FK_14d32753621c875f03d6f32d97b"
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
            ALTER TABLE "tours_tags_tags"
            ADD CONSTRAINT "FK_14d32753621c875f03d6f32d97b" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
    }

}
