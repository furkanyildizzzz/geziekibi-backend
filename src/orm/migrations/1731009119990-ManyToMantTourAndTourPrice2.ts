import {MigrationInterface, QueryRunner} from "typeorm";

export class ManyToMantTourAndTourPrice21731009119990 implements MigrationInterface {
    name = 'ManyToMantTourAndTourPrice21731009119990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "tours_prices_tour_prices" (
                "tours_id" integer NOT NULL,
                "tour_prices_id" integer NOT NULL,
                CONSTRAINT "PK_e62319cdfdd3af8f8845d00076b" PRIMARY KEY ("tours_id", "tour_prices_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_77668018faa1a3b9b231f0e222" ON "tours_prices_tour_prices" ("tours_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e677212dfcbdc9826d6f18cefe" ON "tours_prices_tour_prices" ("tour_prices_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_prices_tour_prices"
            ADD CONSTRAINT "FK_77668018faa1a3b9b231f0e2226" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_prices_tour_prices"
            ADD CONSTRAINT "FK_e677212dfcbdc9826d6f18cefed" FOREIGN KEY ("tour_prices_id") REFERENCES "tour_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours_prices_tour_prices" DROP CONSTRAINT "FK_e677212dfcbdc9826d6f18cefed"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_prices_tour_prices" DROP CONSTRAINT "FK_77668018faa1a3b9b231f0e2226"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e677212dfcbdc9826d6f18cefe"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_77668018faa1a3b9b231f0e222"
        `);
        await queryRunner.query(`
            DROP TABLE "tours_prices_tour_prices"
        `);
    }

}
