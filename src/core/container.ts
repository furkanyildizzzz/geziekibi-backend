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

const container = new Container();

container.bind<IDatabaseService>(INTERFACE_TYPE.IDatabaseService).to(DatabaseService);

container.bind<Logger>(INTERFACE_TYPE.Logger).to(Logger);

container.bind<UnitOfWork>(INTERFACE_TYPE.UnitOfWork).to(UnitOfWork);

container.bind<ITagRepository>(INTERFACE_TYPE.ITagRepository).to(TagRepository);
container.bind<ITagService>(INTERFACE_TYPE.ITagService).to(TagService);
container.bind(INTERFACE_TYPE.TagController).to(TagController);

export default container;
