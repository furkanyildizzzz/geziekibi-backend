import { INTERFACE_TYPE } from 'core/types';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { IBlogCategoryService } from '../interfaces/IBlogCategoryService';
import { inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { CreateBlogCategoryDto } from '../dto/CreateBlogCategoryDto';
import { uploadMiddleware } from 'middleware/multer';

@controller('/blog/category')
export class BlogCategoryController {
  constructor(@inject(INTERFACE_TYPE.IBlogCategoryService) private readonly service: IBlogCategoryService) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const blogCategories = await this.service.getAll();
    return res.customSuccess(200, 'Blog Categories', blogCategories);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const blogCategory = await this.service.getById(req.params.id);
    return res.customSuccess(200, 'Blog Category', blogCategory);
  }

  @httpPost('/', checkJwt, checkRole(['ADMINISTRATOR']), DtoValidationMiddleware(CreateBlogCategoryDto))
  public async create(req: Request, res: Response, nex: NextFunction) {
    const blogCategory = await this.service.createBlogCategory(req.body);
    return res.customSuccess(200, `Blog Category '${blogCategory.name}' created successfully`, blogCategory);
  }

  @httpPost(
    '/:id([0-9]+)',
    checkJwt,
    checkRole(['ADMINISTRATOR']),
    uploadMiddleware,
    DtoValidationMiddleware(CreateBlogCategoryDto),
  )
  public async update(req: Request, res: Response, nex: NextFunction) {
    const blogCategory = await this.service.updateBlogCategory(req.params.id, req.body);
    return res.customSuccess(200, 'Blog Category updated successfully', blogCategory);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteBlogCategory(id);
    return res.customSuccess(200, 'Blog Category deleted successfully');
  }
}
