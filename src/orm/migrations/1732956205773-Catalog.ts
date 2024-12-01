import { MigrationInterface, QueryRunner } from "typeorm";

export class Catalog1732956205773 implements MigrationInterface {
    name = 'Catalog1732956205773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "catalogs" ("id" SERIAL NOT NULL, "originalName" character varying, "publicId" character varying NOT NULL, "url" character varying NOT NULL, "secureUrl" character varying NOT NULL, "format" character varying NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "pages" integer NOT NULL, "bytes" integer NOT NULL, "order" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1883399275415ee6107413fe6c3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "catalogs"`);
    }

}
