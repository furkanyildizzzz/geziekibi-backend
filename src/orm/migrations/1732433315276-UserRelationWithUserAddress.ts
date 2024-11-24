import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRelationWithUserAddress1732433315276 implements MigrationInterface {
    name = 'UserRelationWithUserAddress1732433315276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userAddress" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "userAddress" ADD CONSTRAINT "FK_8b251cbfcbf880bcdec80cf36c5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userAddress" DROP CONSTRAINT "FK_8b251cbfcbf880bcdec80cf36c5"`);
        await queryRunner.query(`ALTER TABLE "userAddress" DROP COLUMN "userId"`);
    }

}
