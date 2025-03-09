import { Container } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { DatabaseService } from 'core/service/DatabaseService';
import { IDatabaseService } from 'core/interface/IDatabaseService';

import { Logger } from 'shared/services/Logger';

import { UnitOfWork } from 'unitOfWork/unitOfWork';

import { IJsonWebTokenService } from 'shared/interfaces/IJsonWebToken';
import { JsonWebTokenService } from 'shared/services/JsonWebToken';

import { IAuthRepository } from 'modules/auth/interfaces/IAuthRepository';
import { IAuthService } from 'modules/auth/interfaces/IAuthService';
import { AuthService } from 'modules/auth/service/AuthService';
import { AuthController } from 'modules/auth/controller/AuthController';
import { AuthRepository } from 'modules/auth/repository/AuthRepository';

import { IUserRepository } from 'modules/user/interfaces/IUserRepository';
import { IUserService } from 'modules/user/interfaces/IUserService';
import { UserService } from 'modules/user/service/UserService';
import { UserController } from 'modules/user/controller/UserController';
import { UserRepository } from 'modules/user/repository/UserRepository';

import { TagController } from 'modules/tag/controller/TagController';
import { ITagService } from 'modules/tag/interfaces/ITagService';
import { TagService } from 'modules/tag/service/TagService';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { TagRepository } from 'modules/tag/repository/TagRepository';

import { ITourCategoryRepository } from 'modules/tourCategory/interfaces/ITourCategoryRepository';
import { ITourCategoryService } from 'modules/tourCategory/interfaces/ITourCategoryService';
import { TourCategoryController } from 'modules/tourCategory/controller/TourCategoryController';
import { TourCategoryRepository } from 'modules/tourCategory/repository/TourCategoryRepository';
import { TourCategoryService } from 'modules/tourCategory/service/TourCategoryService';

import { IServiceRepository } from 'modules/service/interfaces/IServiceRepository';
import { ServiceRepository } from 'modules/service/repository/ServiceRepository';
import { IServiceInteractor } from 'modules/service/interfaces/IServiceInteractor';
import { ServiceInteractor } from 'modules/service/service/ServiceInteractor';
import { ServiceController } from 'modules/service/controller/ServiceController';

import { ITourServiceRepository } from 'modules/tourService/interfaces/ITourServiceRepository';
import { ITourServiceInteractor } from 'modules/tourService/interfaces/ITourServiceInteractor';
import { TourServiceRepository } from 'modules/tourService/repository/TourServiceRepository';
import { TourServiceInteractor } from 'modules/tourService/service/TourServiceInteractor';
import { TourServiceController } from 'modules/tourService/controller/TourServiceController';

import { ITourRepository } from 'modules/tour/interfaces/ITourRepository';
import { ITourService } from 'modules/tour/interfaces/ITourService';
import { TourRepository } from 'modules/tour/repository/TourRepository';
import { TourController } from 'modules/tour/controller/TourController';
import { TourService } from 'modules/tour/service/TourService';
import { TourDailyPathController } from 'modules/tourDailyPath/controller/TourDailyPathController';
import { TourDailyPathRepository } from 'modules/tourDailyPath/repository/TourDailyPathRepository';
import { TourDailyPathService } from 'modules/tourDailyPath/service/TourDailyPathService';
import { ITourDailyPathRepository } from 'modules/tourDailyPath/interfaces/ITourDailyPathRepository';
import { ITourDailyPathService } from 'modules/tourDailyPath/interfaces/ITourDailyPathService';
import { IBlogCategoryRepository } from 'modules/blogCategory/interfaces/IBlogCategoryRepository';
import { IBlogCategoryService } from 'modules/blogCategory/interfaces/IBlogCategoryService';
import { BlogCategoryRepository } from 'modules/blogCategory/repository/BlogCategoryRepository';
import { BlogCategoryService } from 'modules/blogCategory/service/BlogCategoryService';
import { BlogCategoryController } from 'modules/blogCategory/controller/BlogCategoryController';
import { IBlogRepository } from 'modules/blog/interfaces/IBlogRepository';
import { IBlogService } from 'modules/blog/interfaces/IBlogService';
import { BlogRepository } from 'modules/blog/repository/BlogRepository';
import { BlogService } from 'modules/blog/service/BlogService';
import { BlogController } from 'modules/blog/controller/BlogController';
import { IStaticPageRepository } from 'modules/staticPage/interfaces/IStaticPageRepository';
import { IStaticPageService } from 'modules/staticPage/interfaces/IStaticPageService';
import { StaticPageRepository } from 'modules/staticPage/repository/StaticPageRepository';
import { StaticPageService } from 'modules/staticPage/service/StaticPageService';
import { StaticPageController } from 'modules/staticPage/controller/StaticPageController';
import { ICatalogRepository } from 'modules/catalog/interfaces/ICatalogRepository';
import { ICatalogService } from 'modules/catalog/interfaces/ICatalogService';
import { CatalogRepository } from 'modules/catalog/repository/CatalogRepository';
import { CatalogService } from 'modules/catalog/service/CatalogService';
import { CatalogController } from 'modules/catalog/controller/CatalogController';
import { IHomepageService } from 'modules/website-modules/homepage/interfaces/IHomepageService';
import { HomepageService } from 'modules/website-modules/homepage/service/HomepageService';
import { HomepageController } from 'modules/website-modules/homepage/controller/HomepageController';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';
import { SeoLinkService } from 'shared/services/SeoLinkService';
import { IBlogServiceWeb } from 'modules/website-modules/blog/interfaces/IBlogServiceWeb';
import { BlogServiceWeb } from 'modules/website-modules/blog/service/BlogServiceWeb';
import { BlogControllerWeb } from 'modules/website-modules/blog/controller/BlogControllerWeb';
import { ITourServiceWeb } from 'modules/website-modules/tour/interfaces/ITourServiceWeb';
import { TourControllerWeb } from 'modules/website-modules/tour/controller/TourControllerWeb';
import { TourServiceWeb } from 'modules/website-modules/tour/service/TourServiceWeb';
import { ITourRepositoryWeb } from 'modules/website-modules/tour/interfaces/ITourRepositoryWeb';
import { TourRepositoryWeb } from 'modules/website-modules/tour/repository/TourRepositoryWeb';
import { IContactFormRepository } from 'modules/contactForm/interfaces/IContactFormRepository';
import { IContactFormService } from 'modules/contactForm/interfaces/IContactFormService';
import { ContactFormRepository } from 'modules/contactForm/repository/ContactFormRepository';
import { ContactFormService } from 'modules/contactForm/service/ContactFormService';
import { ContactFormController } from 'modules/contactForm/controller/ContactFormController';
import { IFaqRepository } from 'modules/faq/interfaces/IFaqRepository';
import { IFaqService } from 'modules/faq/interfaces/IFaqService';
import { FaqService } from 'modules/faq/service/FaqService';
import { FaqRepository } from 'modules/faq/repository/FaqRepository';
import { FaqController } from 'modules/faq/controller/FaqController';
import { IHomepageSliderRepository } from 'modules/homepageSlider/interfaces/IHomepageSliderRepository';
import { IHomepageSliderService } from 'modules/homepageSlider/interfaces/IHomepageSliderService';
import { HomepageSliderController } from 'modules/homepageSlider/controller/HomepageSliderController';
import { HomepageSliderService } from 'modules/homepageSlider/service/HomepageSliderService';
import { HomepageSliderRepository } from 'modules/homepageSlider/repository/HomepageSliderRepository';
import { IEmailService } from 'shared/interfaces/IEmailService';
import { EmailService } from 'shared/services/EmailService';
import { EmailController } from 'modules/email/controller/EmailController';
import { IImageRepository } from 'shared/interfaces/IImageRepository';
import { ImageService } from 'shared/services/ImageService';
import { IImageService } from 'shared/interfaces/IImageService';
import { ImageRepository } from 'shared/repositories/ImageRepository';
import { ITourDailyRepository } from 'modules/tour/interfaces/ITourDailyRepository';
import { TourDailyRepository } from 'modules/tour/repository/TourDailyRepository';
import { TourDateRepository } from 'modules/tour/repository/TourDateRepository';
import { ITourDateRepository } from 'modules/tour/interfaces/ITourDateRepository';
import { TourPriceRepository } from 'modules/tour/repository/TourPriceRepository';
import { ITourPriceRepository } from 'modules/tour/interfaces/ITourPriceRepository';

const container = new Container();

container.bind<IDatabaseService>(INTERFACE_TYPE.IDatabaseService).to(DatabaseService);

container.bind<Logger>(INTERFACE_TYPE.Logger).to(Logger);

container.bind<UnitOfWork>(INTERFACE_TYPE.UnitOfWork).to(UnitOfWork).inRequestScope();

container.bind<IJsonWebTokenService>(INTERFACE_TYPE.IJsonWebTokenService).to(JsonWebTokenService);

container.bind<IAuthRepository>(INTERFACE_TYPE.IAuthRepository).to(AuthRepository);
container.bind<IAuthService>(INTERFACE_TYPE.IAuthService).to(AuthService);
container.bind(INTERFACE_TYPE.AuthController).to(AuthController);

container.bind<IUserRepository>(INTERFACE_TYPE.IUserRepository).to(UserRepository);
container.bind<IUserService>(INTERFACE_TYPE.IUserService).to(UserService);
container.bind(INTERFACE_TYPE.UserController).to(UserController);

container.bind<ITagRepository>(INTERFACE_TYPE.ITagRepository).to(TagRepository);
container.bind<ITagService>(INTERFACE_TYPE.ITagService).to(TagService);
container.bind(INTERFACE_TYPE.TagController).to(TagController);

container.bind<ITourCategoryRepository>(INTERFACE_TYPE.ITourCategoryRepository).to(TourCategoryRepository);
container.bind<ITourCategoryService>(INTERFACE_TYPE.ITourCategoryService).to(TourCategoryService);
container.bind(INTERFACE_TYPE.TourCategoryController).to(TourCategoryController);

container.bind<IServiceRepository>(INTERFACE_TYPE.IServiceRepository).to(ServiceRepository);
container.bind<IServiceInteractor>(INTERFACE_TYPE.IServiceInteractor).to(ServiceInteractor);
container.bind(INTERFACE_TYPE.ServiceController).to(ServiceController);

container.bind<ITourServiceRepository>(INTERFACE_TYPE.ITourServiceRepository).to(TourServiceRepository);
container.bind<ITourServiceInteractor>(INTERFACE_TYPE.ITourServiceInteractor).to(TourServiceInteractor);
container.bind(INTERFACE_TYPE.TourServiceController).to(TourServiceController);

container.bind<ITourRepository>(INTERFACE_TYPE.ITourRepository).to(TourRepository);
container.bind<ITourService>(INTERFACE_TYPE.ITourService).to(TourService);
container.bind(INTERFACE_TYPE.TourController).to(TourController);

container.bind<ITourDailyPathRepository>(INTERFACE_TYPE.ITourDailyPathRepository).to(TourDailyPathRepository);
container.bind<ITourDailyPathService>(INTERFACE_TYPE.ITourDailyPathService).to(TourDailyPathService);
container.bind(INTERFACE_TYPE.TourDailyPathController).to(TourDailyPathController);

container.bind<ITourDailyRepository>(INTERFACE_TYPE.ITourDailyRepository).to(TourDailyRepository);
container.bind<ITourDateRepository>(INTERFACE_TYPE.ITourDateRepository).to(TourDateRepository);
container.bind<ITourPriceRepository>(INTERFACE_TYPE.ITourPriceRepository).to(TourPriceRepository);

container.bind<IBlogCategoryRepository>(INTERFACE_TYPE.IBlogCategoryRepository).to(BlogCategoryRepository);
container.bind<IBlogCategoryService>(INTERFACE_TYPE.IBlogCategoryService).to(BlogCategoryService);
container.bind(INTERFACE_TYPE.BlogCategoryController).to(BlogCategoryController);

container.bind<IBlogRepository>(INTERFACE_TYPE.IBlogRepository).to(BlogRepository);
container.bind<IBlogService>(INTERFACE_TYPE.IBlogService).to(BlogService);
container.bind(INTERFACE_TYPE.BlogController).to(BlogController);

container.bind<IStaticPageRepository>(INTERFACE_TYPE.IStaticPageRepository).to(StaticPageRepository);
container.bind<IStaticPageService>(INTERFACE_TYPE.IStaticPageService).to(StaticPageService);
container.bind(INTERFACE_TYPE.StaticPageController).to(StaticPageController);

container.bind<ICatalogRepository>(INTERFACE_TYPE.ICatalogRepository).to(CatalogRepository);
container.bind<ICatalogService>(INTERFACE_TYPE.ICatalogService).to(CatalogService);
container.bind(INTERFACE_TYPE.CatalogController).to(CatalogController);

container.bind<IHomepageService>(INTERFACE_TYPE.IHomepageService).to(HomepageService);
container.bind(INTERFACE_TYPE.HomepageController).to(HomepageController);

container.bind<ISeoLinkService>(INTERFACE_TYPE.ISeoLinkService).to(SeoLinkService);

container.bind<IBlogServiceWeb>(INTERFACE_TYPE.IBlogServiceWeb).to(BlogServiceWeb);
container.bind(INTERFACE_TYPE.BlogControllerWeb).to(BlogControllerWeb);

container.bind<ITourRepositoryWeb>(INTERFACE_TYPE.ITourRepositoryWeb).to(TourRepositoryWeb);
container.bind<ITourServiceWeb>(INTERFACE_TYPE.ITourServiceWeb).to(TourServiceWeb);
container.bind(INTERFACE_TYPE.TourControllerWeb).to(TourControllerWeb);

container.bind<IContactFormRepository>(INTERFACE_TYPE.IContactFormRepository).to(ContactFormRepository);
container.bind<IContactFormService>(INTERFACE_TYPE.IContactFormService).to(ContactFormService);
container.bind(INTERFACE_TYPE.ContactFormController).to(ContactFormController);

container.bind<IFaqRepository>(INTERFACE_TYPE.IFaqRepository).to(FaqRepository);
container.bind<IFaqService>(INTERFACE_TYPE.IFaqService).to(FaqService);
container.bind(INTERFACE_TYPE.FaqController).to(FaqController);

container.bind<IHomepageSliderRepository>(INTERFACE_TYPE.IHomepageSliderRepository).to(HomepageSliderRepository);
container.bind<IHomepageSliderService>(INTERFACE_TYPE.IHomepageSliderService).to(HomepageSliderService);
container.bind(INTERFACE_TYPE.HomepageSliderController).to(HomepageSliderController);

container.bind<IEmailService>(INTERFACE_TYPE.IEmailService).to(EmailService);
container.bind(INTERFACE_TYPE.IEmailController).to(EmailController);

container.bind<IImageRepository>(INTERFACE_TYPE.IImageRepository).to(ImageRepository);
container.bind<IImageService>(INTERFACE_TYPE.IImageService).to(ImageService);
export default container;
