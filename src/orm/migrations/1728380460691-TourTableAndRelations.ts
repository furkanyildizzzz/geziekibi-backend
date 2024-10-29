import {MigrationInterface, QueryRunner} from "typeorm";

export class TourTableAndRelations1728380460691 implements MigrationInterface {
    name = 'TourTableAndRelations1728380460691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "tour_prices" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying NOT NULL,
                "price" numeric NOT NULL,
                "currency" character varying NOT NULL DEFAULT 'TRY',
                "tour_id" integer,
                CONSTRAINT "PK_fa3b74cad6c6c372f1d9a8ff96c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "tour_services" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_42411c2819767148821dbe0b541" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "tours" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "body" text NOT NULL,
                "category" character varying NOT NULL DEFAULT 'YURTICI',
                "publish_status" character varying NOT NULL DEFAULT 'DRAFT',
                "publish_date" TIMESTAMP NOT NULL DEFAULT now(),
                "image" character varying NOT NULL,
                "gallery" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_2202ba445792c1ad0edf2de8de2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "tags" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "tours_tags_tags" (
                "tours_id" integer NOT NULL,
                "tags_id" integer NOT NULL,
                CONSTRAINT "PK_5b1bd038d5b841a937fe8a4328d" PRIMARY KEY ("tours_id", "tags_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_14d32753621c875f03d6f32d97" ON "tours_tags_tags" ("tours_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_43bc37fc2069b820d37fb3ea16" ON "tours_tags_tags" ("tags_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "tours_included_services_tour_services" (
                "tours_id" integer NOT NULL,
                "tour_services_id" integer NOT NULL,
                CONSTRAINT "PK_815aa6e110dfcb8f4740458014f" PRIMARY KEY ("tours_id", "tour_services_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_36346d0a5cda55f8a59c3a4028" ON "tours_included_services_tour_services" ("tours_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4e4d99433b4e4738cef3501960" ON "tours_included_services_tour_services" ("tour_services_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "tours_excluded_services_tour_services" (
                "tours_id" integer NOT NULL,
                "tour_services_id" integer NOT NULL,
                CONSTRAINT "PK_a15388d31d90119075081f8c177" PRIMARY KEY ("tours_id", "tour_services_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_0e62a2636c1d9e0769554279e3" ON "tours_excluded_services_tour_services" ("tours_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_9fc928ed7c2f24813916eb5d97" ON "tours_excluded_services_tour_services" ("tour_services_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_prices"
            ADD CONSTRAINT "FK_651d6613f928ea20447011f04df" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags"
            ADD CONSTRAINT "FK_14d32753621c875f03d6f32d97b" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags"
            ADD CONSTRAINT "FK_43bc37fc2069b820d37fb3ea166" FOREIGN KEY ("tags_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_included_services_tour_services"
            ADD CONSTRAINT "FK_36346d0a5cda55f8a59c3a4028c" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_included_services_tour_services"
            ADD CONSTRAINT "FK_4e4d99433b4e4738cef35019605" FOREIGN KEY ("tour_services_id") REFERENCES "tour_services"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_excluded_services_tour_services"
            ADD CONSTRAINT "FK_0e62a2636c1d9e0769554279e38" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_excluded_services_tour_services"
            ADD CONSTRAINT "FK_9fc928ed7c2f24813916eb5d970" FOREIGN KEY ("tour_services_id") REFERENCES "tour_services"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tours_excluded_services_tour_services" DROP CONSTRAINT "FK_9fc928ed7c2f24813916eb5d970"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_excluded_services_tour_services" DROP CONSTRAINT "FK_0e62a2636c1d9e0769554279e38"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_included_services_tour_services" DROP CONSTRAINT "FK_4e4d99433b4e4738cef35019605"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_included_services_tour_services" DROP CONSTRAINT "FK_36346d0a5cda55f8a59c3a4028c"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags" DROP CONSTRAINT "FK_43bc37fc2069b820d37fb3ea166"
        `);
        await queryRunner.query(`
            ALTER TABLE "tours_tags_tags" DROP CONSTRAINT "FK_14d32753621c875f03d6f32d97b"
        `);
        await queryRunner.query(`
            ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_651d6613f928ea20447011f04df"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_9fc928ed7c2f24813916eb5d97"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_0e62a2636c1d9e0769554279e3"
        `);
        await queryRunner.query(`
            DROP TABLE "tours_excluded_services_tour_services"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_4e4d99433b4e4738cef3501960"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_36346d0a5cda55f8a59c3a4028"
        `);
        await queryRunner.query(`
            DROP TABLE "tours_included_services_tour_services"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_43bc37fc2069b820d37fb3ea16"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_14d32753621c875f03d6f32d97"
        `);
        await queryRunner.query(`
            DROP TABLE "tours_tags_tags"
        `);
        await queryRunner.query(`
            DROP TABLE "tags"
        `);
        await queryRunner.query(`
            DROP TABLE "tours"
        `);
        await queryRunner.query(`
            DROP TABLE "tour_services"
        `);
        await queryRunner.query(`
            DROP TABLE "tour_prices"
        `);
    }

}
