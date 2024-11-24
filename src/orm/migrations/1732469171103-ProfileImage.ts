import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfileImage1732469171103 implements MigrationInterface {
    name = 'ProfileImage1732469171103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_96514329909c945f10974aff5f8"`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "UQ_96514329909c945f10974aff5f8" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_96514329909c945f10974aff5f8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_96514329909c945f10974aff5f8"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "UQ_96514329909c945f10974aff5f8"`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_96514329909c945f10974aff5f8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
