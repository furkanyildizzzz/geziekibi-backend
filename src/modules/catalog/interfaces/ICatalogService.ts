import { Catalog } from 'orm/entities/catalog/Catalog';
import { UpdateCatalogDto } from '../dto/UpdateCatalogDto';

export interface ICatalogService {
  getAll(): Promise<Catalog[]>;
  getById(id: string): Promise<Catalog>;
  getByPublicId(publicId: string): Promise<Catalog>;
  updateCatalog(id: string, catalogData: UpdateCatalogDto): Promise<Catalog>;
  uploadCatalog(file: Express.Multer.File): Promise<Catalog>;
  deleteCatalog(id: string): Promise<void>;
}
