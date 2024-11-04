import {MigrationInterface, QueryRunner} from "typeorm";

export class Service1730563889235 implements MigrationInterface {
    name = 'Service1730563889235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags" DROP CONSTRAINT "FK_14d32753621c875f03d6f32d97b"
        `);
        await queryRunner.query(`
            CREATE TABLE "services" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "UQ_019d74f7abcdcb5a0113010cb03" UNIQUE ("name"),
                CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "category"
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services" DROP COLUMN "name"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."tours_type_enum" AS ENUM('yurtdisi', 'yurtici', 'gunubirlik')
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "type" "public"."tours_type_enum" NOT NULL DEFAULT 'yurtici'
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "category_id" integer
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."tour_services_type_enum" AS ENUM('included', 'excluded')
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services"
            ADD "type" "public"."tour_services_type_enum" NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services"
            ADD "tour_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services"
            ADD "service_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_prices" DROP COLUMN "currency"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."tour_prices_currency_enum" AS ENUM('try', 'usd', 'eur')
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_prices"
            ADD "currency" "public"."tour_prices_currency_enum" NOT NULL DEFAULT 'try'
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "publish_status"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."tours_publish_status_enum" AS ENUM('publish', 'draft', 'unpublish')
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "publish_status" "public"."tours_publish_status_enum" NOT NULL DEFAULT 'draft'
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD CONSTRAINT "FK_facd344449ad26f464e9681c0ab" FOREIGN KEY ("category_id") REFERENCES "tour_categories"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services"
            ADD CONSTRAINT "FK_ed1b275889866644832fa40eba4" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services"
            ADD CONSTRAINT "FK_1e1cd46e72626852037fd88541e" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags"
            ADD CONSTRAINT "FK_14d32753621c875f03d6f32d97b" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags" DROP CONSTRAINT "FK_14d32753621c875f03d6f32d97b"
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services" DROP CONSTRAINT "FK_1e1cd46e72626852037fd88541e"
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services" DROP CONSTRAINT "FK_ed1b275889866644832fa40eba4"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP CONSTRAINT "FK_facd344449ad26f464e9681c0ab"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "publish_status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."tours_publish_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "publish_status" character varying NOT NULL DEFAULT 'DRAFT'
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_prices" DROP COLUMN "currency"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."tour_prices_currency_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_prices"
            ADD "currency" character varying NOT NULL DEFAULT 'TRY'
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services" DROP COLUMN "service_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services" DROP COLUMN "tour_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services" DROP COLUMN "type"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."tour_services_type_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "category_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours" DROP COLUMN "type"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."tours_type_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_services"
            ADD "name" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tours"
            ADD "category" character varying NOT NULL DEFAULT 'YURTICI'
        `);
        await queryRunner.query(`
            DROP TABLE "services"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags"
            ADD CONSTRAINT "FK_14d32753621c875f03d6f32d97b" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

}
