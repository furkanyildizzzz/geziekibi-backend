import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { ICatalogService } from '../interfaces/ICatalogService';
import { NextFunction, Request, Response } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { uploadMiddleware } from 'middleware/multer';
import { UpdateCatalogDto } from '../dto/UpdateCatalogDto';

@controller('/panel/catalog')
export class CatalogController {
  constructor(@inject(INTERFACE_TYPE.ICatalogService) private readonly service: ICatalogService) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const catalogs = await this.service.getAll();
    return res.customSuccess(200, 'Catalogs', catalogs);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const catalog = await this.service.getById(req.params.id);
    return res.customSuccess(200, 'Catalog found', catalog);
  }

  @httpPost('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(UpdateCatalogDto))
  public async update(req: Request, res: Response, nex: NextFunction) {
    const catalog = await this.service.updateCatalog(req.params.id, req.body);
    return res.customSuccess(200, 'Catalog updated successfully', catalog);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteCatalog(id);
    return res.customSuccess(200, 'Catalog deleted successfully');
  }

  @httpPost('/upload', checkJwt, checkRole(['ADMINISTRATOR']), uploadMiddleware)
  public async upload(req: Request, res: Response, next: NextFunction) {
    const catalog = await this.service.uploadCatalog(req.files['catalogFile'][0]);
    return res.customSuccess(200, 'Catalog file uploaded successfully', catalog);
  }
}
