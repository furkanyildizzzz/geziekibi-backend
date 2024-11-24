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

const container = new Container();

container.bind<IDatabaseService>(INTERFACE_TYPE.IDatabaseService).to(DatabaseService);

container.bind<Logger>(INTERFACE_TYPE.Logger).to(Logger);

container.bind<UnitOfWork>(INTERFACE_TYPE.UnitOfWork).to(UnitOfWork);

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

export default container;
