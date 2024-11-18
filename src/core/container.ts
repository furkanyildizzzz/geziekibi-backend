import { Container } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { DatabaseService } from 'core/service/DatabaseService';
import { IDatabaseService } from 'core/interface/IDatabaseService';

import { Logger } from 'shared/services/Logger';

import { UnitOfWork } from 'unitOfWork/unitOfWork';

import { TagController } from 'modules/tag/controller/TagController';
import { ITagService } from 'modules/tag/interfaces/ITagService';
import { TagService } from 'modules/tag/service/TagService';
import { ITagRepository } from 'modules/tag/interfaces/ITagRepository';
import { TagRepository } from 'modules/tag/repository/TagRepository';
import { IJsonWebTokenService } from 'shared/interfaces/IJsonWebToken';
import { JsonWebTokenService } from 'shared/services/JsonWebToken';
import { IAuthRepository } from 'modules/auth/interfaces/IAuthRepository';
import { IAuthService } from 'modules/auth/interfaces/IAuthService';
import { AuthService } from 'modules/auth/service/AuthService';
import { AuthController } from 'modules/auth/controller/AuthController';
import { AuthRepository } from 'modules/auth/repository/AuthRepository';
import { ITourCategoryRepository } from 'modules/tourCategory/interfaces/ITourCategoryRepository';
import { ITourCategoryService } from 'modules/tourCategory/interfaces/ITourCategoryService';
import { TourCategoryController } from 'modules/tourCategory/controller/TourCategoryController';
import { TourCategoryRepository } from 'modules/tourCategory/repository/TourCategoryRepository';
import { TourCategoryService } from 'modules/tourCategory/service/TourCategoryService';

const container = new Container();

container.bind<IDatabaseService>(INTERFACE_TYPE.IDatabaseService).to(DatabaseService);

container.bind<Logger>(INTERFACE_TYPE.Logger).to(Logger);

container.bind<UnitOfWork>(INTERFACE_TYPE.UnitOfWork).to(UnitOfWork);

container.bind<IJsonWebTokenService>(INTERFACE_TYPE.IJsonWebTokenService).to(JsonWebTokenService);

container.bind<IAuthRepository>(INTERFACE_TYPE.IAuthRepository).to(AuthRepository);
container.bind<IAuthService>(INTERFACE_TYPE.IAuthService).to(AuthService);
container.bind(INTERFACE_TYPE.AuthController).to(AuthController);

container.bind<ITagRepository>(INTERFACE_TYPE.ITagRepository).to(TagRepository);
container.bind<ITagService>(INTERFACE_TYPE.ITagService).to(TagService);
container.bind(INTERFACE_TYPE.TagController).to(TagController);

container.bind<ITourCategoryRepository>(INTERFACE_TYPE.ITourCategoryRepository).to(TourCategoryRepository);
container.bind<ITourCategoryService>(INTERFACE_TYPE.ITourCategoryService).to(TourCategoryService);
container.bind(INTERFACE_TYPE.TourCategoryController).to(TourCategoryController);

export default container;
