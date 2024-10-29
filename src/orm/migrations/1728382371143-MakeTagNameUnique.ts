import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeTagNameUnique1728382371143 implements MigrationInterface {
    name = 'MakeTagNameUnique1728382371143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tags"
            ADD CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tags" DROP CONSTRAINT "UQ_d90243459a697eadb8ad56e9092"
        `);
    }

}
