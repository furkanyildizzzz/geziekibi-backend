import { TourService } from "orm/entities/tour/TourService";
import { IBaseRepository } from "shared/interfaces/IBaseRepository";

export interface ITourServiceRepository extends IBaseRepository<TourService> {}
