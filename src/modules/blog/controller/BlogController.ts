import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { IBlogService } from '../interfaces/IBlogService';
import { NextFunction, Request, Response } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { uploadMiddleware } from 'middleware/multer';
import { CreateBlogDto } from '../dto/CreateBlogDto';

@controller('/panel/blog')
export class BlogController {
  constructor(@inject(INTERFACE_TYPE.IBlogService) private readonly service: IBlogService) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const blogs = await this.service.getAll();
    return res.customSuccess(200, 'Blogs', blogs);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const blog = await this.service.getById(req.params.id);
    return res.customSuccess(200, 'Blog found', blog);
  }

  @httpPost('/', checkJwt, checkRole(['ADMINISTRATOR']), uploadMiddleware, DtoValidationMiddleware(CreateBlogDto, true))
  public async create(req: Request, res: Response, next: NextFunction) {
    const blog = await this.service.createBlog(req.body);
    return res.customSuccess(200, 'Blog saved successfully', blog);
  }

  @httpPost(
    '/:id([0-9]+)',
    checkJwt,
    checkRole(['ADMINISTRATOR']),
    uploadMiddleware,
    DtoValidationMiddleware(CreateBlogDto, true),
  )
  public async update(req: Request, res: Response, next: NextFunction) {
    const blog = await this.service.updateBlog(req.params.id, req.body);
    return res.customSuccess(200, 'Blog updated successfully', blog);
  }

  @httpDelete('/:id([0-9]+)', checkJwt, checkRole(['ADMINISTRATOR']))
  public async delete(req: Request, res: Response, nex: NextFunction) {
    const id = req.params.id;
    await this.service.deleteBlog(id);
    return res.customSuccess(200, 'Blog deleted successfully');
  }

  @httpPost('/uploadBodyImage', checkJwt, checkRole(['ADMINISTRATOR']), uploadMiddleware)
  public async uploadBodyImage(req: Request, res: Response, next: NextFunction) {
    const imageUrl = await this.service.uploadBodyImage(req.files['uploadBodyImage'][0]);
    return res.customSuccess(200, 'Blog body image uploaded successfully', imageUrl);
  }
}
