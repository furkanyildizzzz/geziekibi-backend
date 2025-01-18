import { MigrationInterface, QueryRunner } from "typeorm";

export class ContactForm1736592939801 implements MigrationInterface {
    name = 'ContactForm1736592939801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_form" ("id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying NOT NULL, "phone" character varying, "message" text NOT NULL, "agree_to_terms" boolean NOT NULL, CONSTRAINT "PK_1f26699518c7f6f08fa91c84e13" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "contact_form"`);
    }

}
