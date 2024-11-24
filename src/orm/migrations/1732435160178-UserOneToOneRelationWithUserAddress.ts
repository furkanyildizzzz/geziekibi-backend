import { MigrationInterface, QueryRunner } from "typeorm";

export class UserOneToOneRelationWithUserAddress1732435160178 implements MigrationInterface {
    name = 'UserOneToOneRelationWithUserAddress1732435160178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userAddress" DROP CONSTRAINT "FK_8b251cbfcbf880bcdec80cf36c5"`);
        await queryRunner.query(`ALTER TABLE "userAddress" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "addressId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_bafb08f60d7857f4670c172a6ea" UNIQUE ("addressId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_bafb08f60d7857f4670c172a6ea" FOREIGN KEY ("addressId") REFERENCES "userAddress"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_bafb08f60d7857f4670c172a6ea"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_bafb08f60d7857f4670c172a6ea"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "addressId"`);
        await queryRunner.query(`ALTER TABLE "userAddress" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "userAddress" ADD CONSTRAINT "FK_8b251cbfcbf880bcdec80cf36c5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
