import slugify from 'slugify'; // Install via npm: npm install slugify
import { getRepository } from 'typeorm';

export const generateSeoLink = (str: string): string => {
  return slugify(str, {
    lower: true, // Convert to lowercase
    strict: true, // Remove special characters
    replacement: '-', // Replace spaces with dashes
  });
};

export const isSeoLinkUnique = async (seoLink: string, entity: string): Promise<boolean> => {
  const repositories = {
    tour: getRepository('Tour'),
    tourCategory: getRepository('TourCategory'),
    blog: getRepository('Blog'),
    blogCategory: getRepository('BlogCategory'),
    catalog: getRepository('Catalog'),
    tag: getRepository('Tag'),
    user: getRepository('User'),
  };

  for (const [key, repo] of Object.entries(repositories)) {
    if (key === entity) continue; // Skip checking the current entity
    const existing = await repo.findOne({ where: { seoLink } });
    if (existing) return false;
  }

  return true;
};

export const generateUniqueSeoLink = async (title: string, entity: string): Promise<string> => {
  let baseLink = generateSeoLink(title);
  let uniqueLink = baseLink;
  let counter = 1;

  // while (!(await isSeoLinkUnique(uniqueLink, entity))) {
  //   uniqueLink = `${baseLink}-${counter}`;
  //   counter++;
  // }

  return uniqueLink;
};
