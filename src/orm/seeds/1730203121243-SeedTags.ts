import { Tag } from 'orm/entities/tag/Tag';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTags1730203121243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tagRepository = getRepository(Tag);

    let tag = new Tag();
    tag.name = 'First Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Second Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Third Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Fourth Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Fifth Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Sixth Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Seventh Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Eighth Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Nineth Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Tenth Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Eleventh Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Twelveth Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Thirteenth Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Fourteenth Tag';
    await tagRepository.save(tag);

    tag = new Tag();
    tag.name = 'Fifteentheenth Tag';
    await tagRepository.save(tag);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
