import { Catalog } from 'orm/entities/catalog/Catalog';

export interface ICatalogRepository {
  getAll(): Promise<Catalog[] | void>;
  getById(id: number): Promise<Catalog | void>;
  getByPublicId(publicId: string): Promise<Catalog | void>;
  getBySeoLink(seoLink: string): Promise<Catalog | void>;
  create(newCatalog: Catalog): Promise<Catalog>;
  update(id: number, tag: Catalog): Promise<Catalog>;
  delete(id: number): Promise<void>;
}
