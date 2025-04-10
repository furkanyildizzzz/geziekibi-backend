import { inject, injectable } from 'inversify';
import { ICatalogService } from '../interfaces/ICatalogService';
import { INTERFACE_TYPE } from 'core/types';
import { ICatalogRepository } from '../interfaces/ICatalogRepository';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { Catalog } from 'orm/entities/catalog/Catalog';
import { Image } from 'orm/entities/image/Image';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import uploadStream from 'shared/services/uploadStream';
import { UpdateCatalogDto } from '../dto/UpdateCatalogDto';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import { IImageService } from 'shared/interfaces/IImageService';
import { Transactional } from 'shared/decorators/Transactional';

@injectable()
export class CatalogService implements ICatalogService {
  constructor(
    @inject(INTERFACE_TYPE.ICatalogRepository) private readonly repository: ICatalogRepository,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
    @inject(INTERFACE_TYPE.IImageService) private readonly imageService: IImageService,
  ) { }

  public async getAll(): Promise<Catalog[]> {
    const catalogs = await this.repository.getAll();
    if (catalogs && catalogs.length)
      return plainToInstance(Catalog, catalogs.reverse(), {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<Catalog> {
    const tourCategory = await this.repository.getById(Number(id));
    if (!tourCategory) throw new NotFoundException(`catalog_not_found`, { id });
    return plainToInstance(Catalog, tourCategory, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getBySeoLink(seoLink: string): Promise<Catalog> {
    const tourCategory = await this.repository.getBySeoLink(seoLink);
    if (!tourCategory) throw new NotFoundException(`catalog_seo_link_not_found`, { seoLink });
    return plainToInstance(Catalog, tourCategory, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getByPublicId(publicId: string): Promise<Catalog> {
    const tourCategory = await this.repository.getByPublicId(publicId);
    if (!tourCategory) throw new NotFoundException(`catalog_public_id_not_found`, { publicId });
    return plainToInstance(Catalog, tourCategory, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  @Transactional()
  public async uploadCatalog(file: Express.Multer.File): Promise<Catalog> {
    if (file) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(now.getDate()).padStart(2, '0');
      const folderDate = `${year}-${month}-${day}`; //_${hour}-${minute};

      try {
        const result = await this.imageService.uploadStream(file.buffer, `/catalog/${folderDate}`);
        console.log({ result });
        const newCatalog = new Catalog();
        newCatalog.originalName = file.originalname;
        newCatalog.seoLink = await this.seoLinkService.generateUniqueSeoLink(
          file.originalname,
          'catalog',
          newCatalog.id,
        );
        newCatalog.publicId = result.public_id;
        newCatalog.url = result.url;
        newCatalog.secureUrl = result.secure_url;
        newCatalog.format = result.format;
        newCatalog.width = result.width;
        newCatalog.height = result.height;
        newCatalog.pages = result.pages;
        newCatalog.bytes = result.bytes;

        newCatalog.createdAt = new Date(result.created_at);
        await this.repository.create(newCatalog);
        return newCatalog;
      } catch (error) {
        console.log({ error });
        throw new InternalServerErrorException("catalog_upload_failed", { fileName: file.originalname });
      }
    }
    throw new BadRequestException('no_file_provided');
  }

  public async updateCatalog(id: string, catalogData: UpdateCatalogDto): Promise<Catalog> {
    try {
      const catalog = await this.repository.getById(Number(id));
      if (!catalog) throw new NotFoundException(`catalog_not_found`, { id });

      catalog.originalName = catalogData.originalName;
      catalog.publishDate = new Date(catalogData.publishDate);
      catalog.publishStatus = catalogData.publishStatus;
      catalog.seoLink = await this.seoLinkService.generateUniqueSeoLink(
        catalogData.originalName,
        'catalog',
        catalog.id,
      );
      await this.repository.update(Number(id), catalog);

      return catalog;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async deleteCatalog(id: string): Promise<void> {
    const tourCategory = await this.repository.getById(Number(id));
    if (!tourCategory) throw new NotFoundException(`catalog_not_found`, { id });
    await this.repository.delete(Number(id));
  }
}
