import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1740142865490 implements MigrationInterface {
    name = 'InitialMigration1740142865490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "services" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_019d74f7abcdcb5a0113010cb03" UNIQUE ("name"), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tour_services_type_enum" AS ENUM('included', 'inherit', 'excluded')`);
        await queryRunner.query(`CREATE TABLE "tour_services" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "type" "public"."tour_services_type_enum" NOT NULL, "tour_id" integer, "service_id" integer, CONSTRAINT "PK_42411c2819767148821dbe0b541" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_addresses" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "secondEmail" character varying, "website" character varying, "address" character varying, "city" character varying, "zipCode" character varying, "country" character varying DEFAULT 'Türkiye', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8abbeb5e3239ff7877088ffc25b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "role" character varying(30) NOT NULL DEFAULT 'STANDART', "language" character varying(15) NOT NULL DEFAULT 'en-US', "bio" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "seo_link" character varying NOT NULL, "addressId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_31317eb20428776352681c1d711" UNIQUE ("seo_link"), CONSTRAINT "REL_bafb08f60d7857f4670c172a6e" UNIQUE ("addressId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_categories" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "description" text, "seo_link" character varying NOT NULL, "parent_id" integer, CONSTRAINT "UQ_21232c6c8d6c2cca3bf240d0c36" UNIQUE ("seo_link"), CONSTRAINT "PK_1056d6faca26b9957f5d26e6572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "homepage_sliders" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "order" integer NOT NULL, "is_active" boolean, CONSTRAINT "PK_a76d9ee0084762abd62f2a7c281" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "originalName" character varying, "publicId" character varying NOT NULL, "url" character varying NOT NULL, "secureUrl" character varying NOT NULL, "format" character varying NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "order" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "tourId" integer, "primaryForTourId" integer, "userId" integer, "categoryId" integer, "blogCategoryId" integer, "blogId" integer, "homepageSliderId" integer, CONSTRAINT "REL_96514329909c945f10974aff5f" UNIQUE ("userId"), CONSTRAINT "REL_7f8e1d228ab22030a05a9454b4" UNIQUE ("homepageSliderId"), CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tour_categories" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "description" text, "seo_link" character varying NOT NULL, "parent_id" integer, CONSTRAINT "UQ_3e33c16c9d5630f1c7d15a7e9b5" UNIQUE ("seo_link"), CONSTRAINT "PK_18a856b2d2c6b1e8dd0d608602c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tour_daily_visiting_places" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "tour_daily_id" integer, CONSTRAINT "PK_8c9fd3b471b7e5e4f1762e11421" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_02bb925316c7c5dda7e86ca373" ON "tour_daily_visiting_places" ("tour_daily_id") `);
        await queryRunner.query(`CREATE TABLE "tour_daily_paths" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, CONSTRAINT "UQ_977fc3fbdf469bc49d578571b45" UNIQUE ("name"), CONSTRAINT "PK_6c2f70779e5617d0ee5e78cd3fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tour_dailies" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "breakfeast" text NOT NULL, "lunch" text NOT NULL, "dinner" text NOT NULL, "description" text NOT NULL, "tour_id" integer, CONSTRAINT "PK_670aeba8381b0d824f7788922ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_46acf21e68a86f53fb77979359" ON "tour_dailies" ("tour_id") `);
        await queryRunner.query(`CREATE TYPE "public"."tour_prices_currency_enum" AS ENUM('try', 'usd', 'eur')`);
        await queryRunner.query(`CREATE TABLE "tour_prices" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "description" character varying, "price" numeric NOT NULL, "currency" "public"."tour_prices_currency_enum" NOT NULL DEFAULT 'try', "tourDateId" integer, CONSTRAINT "PK_fa3b74cad6c6c372f1d9a8ff96c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tour_dates" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "start_date" TIMESTAMP NOT NULL DEFAULT now(), "end_date" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "tourId" integer, CONSTRAINT "PK_9193336e7b817637db047c046d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tours_tour_type_enum" AS ENUM('yurtdisi', 'yurtici', 'gunubirlik')`);
        await queryRunner.query(`CREATE TYPE "public"."tours_publish_status_enum" AS ENUM('publish', 'draft', 'unpublish')`);
        await queryRunner.query(`CREATE TABLE "tours" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "title" character varying NOT NULL, "spot" character varying NOT NULL, "body" text NOT NULL, "tour_type" "public"."tours_tour_type_enum" NOT NULL DEFAULT 'yurtici', "publish_status" "public"."tours_publish_status_enum" NOT NULL DEFAULT 'draft', "start_date" TIMESTAMP NOT NULL DEFAULT now(), "end_date" TIMESTAMP NOT NULL DEFAULT now(), "publish_date" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "seo_link" character varying NOT NULL, "important_notes" text, "category_id" integer, CONSTRAINT "UQ_4938efc67fe53f87d7e128ef588" UNIQUE ("seo_link"), CONSTRAINT "PK_2202ba445792c1ad0edf2de8de2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4938efc67fe53f87d7e128ef58" ON "tours" ("seo_link") `);
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "seo_link" character varying NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "UQ_a13a34966f7e173d43c35cdeab2" UNIQUE ("seo_link"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."blogs_language_enum" AS ENUM('turkish', 'english')`);
        await queryRunner.query(`CREATE TYPE "public"."blogs_publish_status_enum" AS ENUM('publish', 'draft', 'unpublish')`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "title" character varying NOT NULL, "spot" character varying NOT NULL, "body" text NOT NULL, "language" "public"."blogs_language_enum" NOT NULL DEFAULT 'turkish', "publish_status" "public"."blogs_publish_status_enum" NOT NULL DEFAULT 'draft', "publish_date" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "seo_link" character varying NOT NULL, "category_id" integer, CONSTRAINT "UQ_5e1b7a74e04a2027cd3fde2bccd" UNIQUE ("seo_link"), CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."catalogs_publish_status_enum" AS ENUM('publish', 'draft', 'unpublish')`);
        await queryRunner.query(`CREATE TABLE "catalogs" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "originalName" character varying, "publicId" character varying NOT NULL, "url" character varying NOT NULL, "secureUrl" character varying NOT NULL, "format" character varying NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "pages" integer NOT NULL, "bytes" integer NOT NULL, "order" integer NOT NULL DEFAULT '1', "seo_link" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "publish_status" "public"."catalogs_publish_status_enum" NOT NULL DEFAULT 'draft', "publish_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b0cd65fb685447054c178e7f137" UNIQUE ("seo_link"), CONSTRAINT "PK_1883399275415ee6107413fe6c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_form" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying NOT NULL, "phone" character varying, "message" text NOT NULL, "agree_to_terms" boolean NOT NULL, "is_responded" boolean NOT NULL DEFAULT false, "response" text, CONSTRAINT "PK_1f26699518c7f6f08fa91c84e13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "faqs" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "question" character varying NOT NULL, "answer" character varying NOT NULL, "order" integer NOT NULL, CONSTRAINT "UQ_5ebff301edd961cd87a9c464521" UNIQUE ("question"), CONSTRAINT "PK_2ddf4f2c910f8e8fa2663a67bf0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."static_pages_page_type_enum" AS ENUM('page-about-us', 'page-secret-policy', 'page-usage-policy', 'page-information-security-policy', 'page-kvkk-policy', 'page-cookie-policy', 'page-membership-agreement-policy', 'page-human-resources')`);
        await queryRunner.query(`CREATE TABLE "static_pages" ("id" SERIAL NOT NULL, "insert_date" TIMESTAMP NOT NULL DEFAULT now(), "insert_user_id" integer, "update_date" TIMESTAMP NOT NULL DEFAULT now(), "update_user_id" integer, "is_deleted" boolean NOT NULL DEFAULT false, "title" character varying NOT NULL, "body" text NOT NULL, "page_type" "public"."static_pages_page_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_51d5188719a3fb65679933415ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tour_dailies_daily_paths_tour_daily_paths" ("tour_dailies_id" integer NOT NULL, "tour_daily_paths_id" integer NOT NULL, CONSTRAINT "PK_3e43ac1a1b4e4c10708e03dd636" PRIMARY KEY ("tour_dailies_id", "tour_daily_paths_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d3e5cd13305c841d386853780" ON "tour_dailies_daily_paths_tour_daily_paths" ("tour_dailies_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_be9a102f3ae57ec7bd2fa6f48d" ON "tour_dailies_daily_paths_tour_daily_paths" ("tour_daily_paths_id") `);
        await queryRunner.query(`CREATE TABLE "tours_tags_tags" ("tours_id" integer NOT NULL, "tags_id" integer NOT NULL, CONSTRAINT "PK_5b1bd038d5b841a937fe8a4328d" PRIMARY KEY ("tours_id", "tags_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_14d32753621c875f03d6f32d97" ON "tours_tags_tags" ("tours_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_43bc37fc2069b820d37fb3ea16" ON "tours_tags_tags" ("tags_id") `);
        await queryRunner.query(`CREATE TABLE "blogs_tags_tags" ("blogs_id" integer NOT NULL, "tags_id" integer NOT NULL, CONSTRAINT "PK_c5c80295303a602c3250158f0dd" PRIMARY KEY ("blogs_id", "tags_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_abd37453124187f7f887990644" ON "blogs_tags_tags" ("blogs_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3da077225fb0856fd6b0ba4a44" ON "blogs_tags_tags" ("tags_id") `);
        await queryRunner.query(`ALTER TABLE "tour_services" ADD CONSTRAINT "FK_ed1b275889866644832fa40eba4" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_services" ADD CONSTRAINT "FK_1e1cd46e72626852037fd88541e" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_bafb08f60d7857f4670c172a6ea" FOREIGN KEY ("addressId") REFERENCES "user_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_ee34e04bfb55942ce65ae758b79" FOREIGN KEY ("parent_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_f15800a81ae8f332420a6d5b8ba" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_fb4f0028b816901df73c2defa8e" FOREIGN KEY ("primaryForTourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_96514329909c945f10974aff5f8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_3a2d287b78f86659349f85664e4" FOREIGN KEY ("categoryId") REFERENCES "tour_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_25577b35a252e422c2732928131" FOREIGN KEY ("blogCategoryId") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_b73513a1d14c8f2908be932becc" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_7f8e1d228ab22030a05a9454b4e" FOREIGN KEY ("homepageSliderId") REFERENCES "homepage_sliders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_categories" ADD CONSTRAINT "FK_cd7e7a6b10e1153452fae70d093" FOREIGN KEY ("parent_id") REFERENCES "tour_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_daily_visiting_places" ADD CONSTRAINT "FK_02bb925316c7c5dda7e86ca3731" FOREIGN KEY ("tour_daily_id") REFERENCES "tour_dailies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_dailies" ADD CONSTRAINT "FK_46acf21e68a86f53fb779793595" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD CONSTRAINT "FK_4262021ffc6f5bbc97f014d63e1" FOREIGN KEY ("tourDateId") REFERENCES "tour_dates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_dates" ADD CONSTRAINT "FK_30915c0676b49ea86a03e76ae53" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tours" ADD CONSTRAINT "FK_facd344449ad26f464e9681c0ab" FOREIGN KEY ("category_id") REFERENCES "tour_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_dailies_daily_paths_tour_daily_paths" ADD CONSTRAINT "FK_5d3e5cd13305c841d3868537801" FOREIGN KEY ("tour_dailies_id") REFERENCES "tour_dailies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tour_dailies_daily_paths_tour_daily_paths" ADD CONSTRAINT "FK_be9a102f3ae57ec7bd2fa6f48d4" FOREIGN KEY ("tour_daily_paths_id") REFERENCES "tour_daily_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tours_tags_tags" ADD CONSTRAINT "FK_14d32753621c875f03d6f32d97b" FOREIGN KEY ("tours_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tours_tags_tags" ADD CONSTRAINT "FK_43bc37fc2069b820d37fb3ea166" FOREIGN KEY ("tags_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs_tags_tags" ADD CONSTRAINT "FK_abd37453124187f7f887990644c" FOREIGN KEY ("blogs_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blogs_tags_tags" ADD CONSTRAINT "FK_3da077225fb0856fd6b0ba4a44d" FOREIGN KEY ("tags_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs_tags_tags" DROP CONSTRAINT "FK_3da077225fb0856fd6b0ba4a44d"`);
        await queryRunner.query(`ALTER TABLE "blogs_tags_tags" DROP CONSTRAINT "FK_abd37453124187f7f887990644c"`);
        await queryRunner.query(`ALTER TABLE "tours_tags_tags" DROP CONSTRAINT "FK_43bc37fc2069b820d37fb3ea166"`);
        await queryRunner.query(`ALTER TABLE "tours_tags_tags" DROP CONSTRAINT "FK_14d32753621c875f03d6f32d97b"`);
        await queryRunner.query(`ALTER TABLE "tour_dailies_daily_paths_tour_daily_paths" DROP CONSTRAINT "FK_be9a102f3ae57ec7bd2fa6f48d4"`);
        await queryRunner.query(`ALTER TABLE "tour_dailies_daily_paths_tour_daily_paths" DROP CONSTRAINT "FK_5d3e5cd13305c841d3868537801"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"`);
        await queryRunner.query(`ALTER TABLE "tours" DROP CONSTRAINT "FK_facd344449ad26f464e9681c0ab"`);
        await queryRunner.query(`ALTER TABLE "tour_dates" DROP CONSTRAINT "FK_30915c0676b49ea86a03e76ae53"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_4262021ffc6f5bbc97f014d63e1"`);
        await queryRunner.query(`ALTER TABLE "tour_dailies" DROP CONSTRAINT "FK_46acf21e68a86f53fb779793595"`);
        await queryRunner.query(`ALTER TABLE "tour_daily_visiting_places" DROP CONSTRAINT "FK_02bb925316c7c5dda7e86ca3731"`);
        await queryRunner.query(`ALTER TABLE "tour_categories" DROP CONSTRAINT "FK_cd7e7a6b10e1153452fae70d093"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_7f8e1d228ab22030a05a9454b4e"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_b73513a1d14c8f2908be932becc"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_25577b35a252e422c2732928131"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_3a2d287b78f86659349f85664e4"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_96514329909c945f10974aff5f8"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_fb4f0028b816901df73c2defa8e"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_f15800a81ae8f332420a6d5b8ba"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_ee34e04bfb55942ce65ae758b79"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_bafb08f60d7857f4670c172a6ea"`);
        await queryRunner.query(`ALTER TABLE "tour_services" DROP CONSTRAINT "FK_1e1cd46e72626852037fd88541e"`);
        await queryRunner.query(`ALTER TABLE "tour_services" DROP CONSTRAINT "FK_ed1b275889866644832fa40eba4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3da077225fb0856fd6b0ba4a44"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abd37453124187f7f887990644"`);
        await queryRunner.query(`DROP TABLE "blogs_tags_tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_43bc37fc2069b820d37fb3ea16"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_14d32753621c875f03d6f32d97"`);
        await queryRunner.query(`DROP TABLE "tours_tags_tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be9a102f3ae57ec7bd2fa6f48d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d3e5cd13305c841d386853780"`);
        await queryRunner.query(`DROP TABLE "tour_dailies_daily_paths_tour_daily_paths"`);
        await queryRunner.query(`DROP TABLE "static_pages"`);
        await queryRunner.query(`DROP TYPE "public"."static_pages_page_type_enum"`);
        await queryRunner.query(`DROP TABLE "faqs"`);
        await queryRunner.query(`DROP TABLE "contact_form"`);
        await queryRunner.query(`DROP TABLE "catalogs"`);
        await queryRunner.query(`DROP TYPE "public"."catalogs_publish_status_enum"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TYPE "public"."blogs_publish_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."blogs_language_enum"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4938efc67fe53f87d7e128ef58"`);
        await queryRunner.query(`DROP TABLE "tours"`);
        await queryRunner.query(`DROP TYPE "public"."tours_publish_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tours_tour_type_enum"`);
        await queryRunner.query(`DROP TABLE "tour_dates"`);
        await queryRunner.query(`DROP TABLE "tour_prices"`);
        await queryRunner.query(`DROP TYPE "public"."tour_prices_currency_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_46acf21e68a86f53fb77979359"`);
        await queryRunner.query(`DROP TABLE "tour_dailies"`);
        await queryRunner.query(`DROP TABLE "tour_daily_paths"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_02bb925316c7c5dda7e86ca373"`);
        await queryRunner.query(`DROP TABLE "tour_daily_visiting_places"`);
        await queryRunner.query(`DROP TABLE "tour_categories"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TABLE "homepage_sliders"`);
        await queryRunner.query(`DROP TABLE "blog_categories"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_addresses"`);
        await queryRunner.query(`DROP TABLE "tour_services"`);
        await queryRunner.query(`DROP TYPE "public"."tour_services_type_enum"`);
        await queryRunner.query(`DROP TABLE "services"`);
    }

}
