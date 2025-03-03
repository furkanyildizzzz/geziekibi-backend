import { Image } from "orm/entities/image/Image";
import { BaseRepository } from "./BaseRepository";
import { IImageRepository } from "shared/interfaces/IImageRepository";
import { inject } from "inversify";
import { INTERFACE_TYPE } from "core/types";
import { UnitOfWork } from "unitOfWork/unitOfWork";

export class ImageRepository extends BaseRepository<Image> implements IImageRepository {
    constructor(@inject(INTERFACE_TYPE.UnitOfWork) unitOfWork: UnitOfWork) {
        super(unitOfWork, Image)
    }
}