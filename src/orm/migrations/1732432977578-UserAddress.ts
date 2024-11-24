import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddress1732432977578 implements MigrationInterface {
    name = 'UserAddress1732432977578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "userAddress" ("id" SERIAL NOT NULL, "secondEmail" character varying NOT NULL, "website" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "zipCode" character varying NOT NULL, "country" character varying NOT NULL DEFAULT 'TURKEY', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7f1d62962565a6c680274d28c4b" UNIQUE ("secondEmail"), CONSTRAINT "PK_cc72457f081f2979232261c92a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`DROP TABLE "userAddress"`);
    }

}
