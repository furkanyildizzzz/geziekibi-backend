import { MigrationInterface, QueryRunner } from "typeorm";

export class HomepageSlider21737235486334 implements MigrationInterface {
    name = 'HomepageSlider21737235486334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "homepage_sliders" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "is_active" boolean, CONSTRAINT "PK_a76d9ee0084762abd62f2a7c281" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "images" ADD "homepageSliderId" integer`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "UQ_7f8e1d228ab22030a05a9454b4e" UNIQUE ("homepageSliderId")`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_7f8e1d228ab22030a05a9454b4e" FOREIGN KEY ("homepageSliderId") REFERENCES "homepage_sliders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_7f8e1d228ab22030a05a9454b4e"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "UQ_7f8e1d228ab22030a05a9454b4e"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "homepageSliderId"`);
        await queryRunner.query(`DROP TABLE "homepage_sliders"`);
    }

}
