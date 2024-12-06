import { INTERFACE_TYPE } from 'core/types';
import { inject, injectable } from 'inversify';
import { Blog } from 'orm/entities/blog/Blog';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Catalog } from 'orm/entities/catalog/Catalog';
import { Tag } from 'orm/entities/tag/Tag';
import { Tour } from 'orm/entities/tour/Tour';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { User } from 'orm/entities/users/User';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import slugify from 'slugify';
import { UnitOfWork } from 'unitOfWork/unitOfWork';

@injectable()
export class SeoLinkService implements ISeoLinkService {
  constructor(@inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork) {}

  private isSeoLinkUnique = async (seoLink: string, repo: string, id: number): Promise<boolean> => {
    const repositories = {
      tour: await this.unitOfWork.getRepository(Tour),
      tourCategory: await this.unitOfWork.getRepository(TourCategory),
      blog: await this.unitOfWork.getRepository(Blog),
      blogCategory: await this.unitOfWork.getRepository(BlogCategory),
      catalog: await this.unitOfWork.getRepository(Catalog),
      tag: await this.unitOfWork.getRepository(Tag),
      user: await this.unitOfWork.getRepository(User),
    };

    for (const [key, repository] of Object.entries(repositories)) {
      if (key !== repo) continue; // Skip checking the other repos
      const existing = await repository.findOne({ where: { seoLink } });
      if (existing) {
        if (existing.id === id) return true; // Skip checking the current entity
        return false;
      }
    }

    return true;
  };

  public async generateSeoLink(str: string): Promise<string> {
    str = str.replace('&', 've');
    return slugify(str, {
      lower: true, // Convert to lowercase
      strict: true, // Remove special characters
      replacement: '-', // Replace spaces with dashes
      locale: 'tr',
    });
  }
  public async generateUniqueSeoLink(str: string, repo: string, id: number): Promise<string> {
    let baseLink = await this.generateSeoLink(str);
    let uniqueLink = baseLink;
    let counter = 1;

    while (!(await this.isSeoLinkUnique(uniqueLink, repo, id))) {
      uniqueLink = `${baseLink}-${counter}`;
      counter++;
    }

    return uniqueLink;
  }
}
