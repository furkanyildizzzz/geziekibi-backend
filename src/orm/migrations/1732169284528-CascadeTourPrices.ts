import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeTourPrices1732169284528 implements MigrationInterface {
    name = 'CascadeTourPrices1732169284528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD CONSTRAINT "FK_7e6532d89cabfa168189fe9adf8" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
