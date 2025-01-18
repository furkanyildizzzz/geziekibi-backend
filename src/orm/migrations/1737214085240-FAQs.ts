import { MigrationInterface, QueryRunner } from "typeorm";

export class FAQs1737214085240 implements MigrationInterface {
    name = 'FAQs1737214085240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "faqs" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "answer" character varying NOT NULL, "order" integer NOT NULL, CONSTRAINT "UQ_5ebff301edd961cd87a9c464521" UNIQUE ("question"), CONSTRAINT "PK_2ddf4f2c910f8e8fa2663a67bf0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "faqs"`);
    }

}
