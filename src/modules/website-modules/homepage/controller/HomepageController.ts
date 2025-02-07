import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { IHomepageService } from '../interfaces/IHomepageService';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { NextFunction, Request, Response } from 'express';
import { StaticPageType } from 'shared/utils/enum';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { CreateContactFormDto } from '../dto/CreateContactFormDto';

@controller('/website/homepage')
export class HomepageController {
  constructor(@inject(INTERFACE_TYPE.IHomepageService) private readonly service: IHomepageService) {}

  @httpGet('/featuredTours')
  public async getFeaturedTours(req: Request, res: Response, next: NextFunction) {
    const featuredTours = await this.service.getFeaturedTours();
    return res.customSuccess(200, 'Featured Tours', featuredTours);
  }
  @httpGet('/categories')
  public async getCategories(req: Request, res: Response, next: NextFunction) {
    const categories = await this.service.getCategories();
    return res.customSuccess(200, 'Categories', categories);
  }
  @httpGet('/topTours')
  public async getTopTours(req: Request, res: Response, next: NextFunction) {
    const topTours = await this.service.getTopTours();
    return res.customSuccess(200, 'Top Tours', topTours);
  }
  @httpGet('/blogs')
  public async getBlogs(req: Request, res: Response, next: NextFunction) {
    const blogs = await this.service.getBlogs();
    return res.customSuccess(200, 'Blogs', blogs);
  }

  @httpGet('/dailyPaths')
  public async getDailyPaths(req: Request, res: Response, next: NextFunction) {
    const dailyPaths = await this.service.getDailyPaths();
    return res.customSuccess(200, 'Blogs', dailyPaths);
  }

  @httpGet('/staticPage/:pageType')
  public async getBySeoLink(req: Request, res: Response, next: NextFunction) {
    const staticPage = await this.service.getStaticPage(req.params.pageType as StaticPageType);
    return res.customSuccess(200, 'Static page found', staticPage);
  }

  @httpPost('/contactForm/', DtoValidationMiddleware(CreateContactFormDto))
  public async create(req: Request, res: Response, next: NextFunction) {
    const contactForm = await this.service.createContactForm(req.body);
    return res.customSuccess(200, 'Contact form saved successfully', contactForm);
  }

  @httpGet('/faqs')
  public async getFAQs(req: Request, res: Response, next: NextFunction) {
    console.log('I am here!');
    const faqs = await this.service.getFAQs();
    return res.customSuccess(200, 'FAQs', faqs);
  }

  @httpGet('/sliders')
  public async getHomepageSliders(req: Request, res: Response, next: NextFunction) {
    const sliders = await this.service.getHomepageSliders();
    return res.customSuccess(200, 'Homepage Sliders', sliders);
  }
}
