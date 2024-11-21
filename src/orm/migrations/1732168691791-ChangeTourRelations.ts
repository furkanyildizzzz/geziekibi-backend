import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTourRelations1732168691791 implements MigrationInterface {
    name = 'ChangeTourRelations1732168691791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_f15800a81ae8f332420a6d5b8ba"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_fb4f0028b816901df73c2defa8e"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_96514329909c945f10974aff5f8"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD "tourId" integer`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_f15800a81ae8f332420a6d5b8ba" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_fb4f0028b816901df73c2defa8e" FOREIGN KEY ("primaryForTourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_96514329909c945f10974aff5f8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_96514329909c945f10974aff5f8"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_fb4f0028b816901df73c2defa8e"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_f15800a81ae8f332420a6d5b8ba"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP COLUMN "tourId"`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_96514329909c945f10974aff5f8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_fb4f0028b816901df73c2defa8e" FOREIGN KEY ("primaryForTourId") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_f15800a81ae8f332420a6d5b8ba" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
