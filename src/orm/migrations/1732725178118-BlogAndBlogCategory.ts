import { MigrationInterface, QueryRunner } from "typeorm";

export class BlogAndBlogCategory1732725178118 implements MigrationInterface {
    name = 'BlogAndBlogCategory1732725178118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."blogs_language_enum" AS ENUM('turkish', 'english')`);
        await queryRunner.query(`CREATE TYPE "public"."blogs_publish_status_enum" AS ENUM('publish', 'draft', 'unpublish')`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "spot" character varying NOT NULL, "body" text NOT NULL, "language" "public"."blogs_language_enum" NOT NULL DEFAULT 'turkish', "publish_status" "public"."blogs_publish_status_enum" NOT NULL DEFAULT 'draft', "publish_date" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" integer, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "parent_id" integer, CONSTRAINT "PK_1056d6faca26b9957f5d26e6572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blogs_tags_tags" ("blogs_id" integer NOT NULL, "tags_id" integer NOT NULL, CONSTRAINT "PK_c5c80295303a602c3250158f0dd" PRIMARY KEY ("blogs_id", "tags_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_abd37453124187f7f887990644" ON "blogs_tags_tags" ("blogs_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3da077225fb0856fd6b0ba4a44" ON "blogs_tags_tags" ("tags_id") `);
        await queryRunner.query(`ALTER TABLE "images" ADD "blogCategoryId" integer`);
        await queryRunner.query(`ALTER TABLE "images" ADD "blogId" integer`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_ee34e04bfb55942ce65ae758b79" FOREIGN KEY ("parent_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_25577b35a252e422c2732928131" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_b73513a1d14c8f2908be932becc" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs_tags_tags" ADD CONSTRAINT "FK_abd37453124187f7f887990644c" FOREIGN KEY ("blogs_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blogs_tags_tags" ADD CONSTRAINT "FK_3da077225fb0856fd6b0ba4a44d" FOREIGN KEY ("tags_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs_tags_tags" DROP CONSTRAINT "FK_3da077225fb0856fd6b0ba4a44d"`);
        await queryRunner.query(`ALTER TABLE "blogs_tags_tags" DROP CONSTRAINT "FK_abd37453124187f7f887990644c"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_b73513a1d14c8f2908be932becc"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_25577b35a252e422c2732928131"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_ee34e04bfb55942ce65ae758b79"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "blogId"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "blogCategoryId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3da077225fb0856fd6b0ba4a44"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abd37453124187f7f887990644"`);
        await queryRunner.query(`DROP TABLE "blogs_tags_tags"`);
        await queryRunner.query(`DROP TABLE "blog_categories"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TYPE "public"."blogs_publish_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."blogs_language_enum"`);
    }

}
