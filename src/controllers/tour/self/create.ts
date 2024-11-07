import { NextFunction, Request, Response } from 'express';
import { Service } from 'orm/entities/service/Service';
import { Tag } from 'orm/entities/tag/Tag';
import { Tour } from 'orm/entities/tour/Tour';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourPrice } from 'orm/entities/tour/TourPrice';
import { TourService } from 'orm/entities/tour/TourService';
import { ServiceType } from 'orm/entities/tour/types';
import { getManager, getRepository } from 'typeorm';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { v2 } from '../../../config/cloudinaryConfig';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  let { title, spot, body, type, publishStatus, publishDate, categoryId, price } = req.body;
  const tags = JSON.parse(req.body.tags);
  let tourServices = JSON.parse(req.body.tourServices);

  // // Access uploaded files via req.files
  // const image = req.files['image'] ? req.files['image'][0] : null;
  // const gallery = req.files['gallery'] || [];

  const tourRepo = getRepository(Tour);
  const categoryRepo = getRepository(TourCategory);
  const tagRepo = getRepository(Tag);
  const serviceRepo = getRepository(Service);
  const priceRepo = getRepository(TourPrice);
  try {
    if (!(await categoryRepo.findOne(categoryId))) {
      const customError = new CustomError(400, 'General', `Category with id:'${categoryId}' not found`);
      return next(customError);
    }

    console.log({ tags });
    if (tags.length) {
      if ((await tagRepo.findByIds(tags.map((t) => t.id))).length !== tags.length) {
        const customError = new CustomError(400, 'General', `One or more tags not found`);
        return next(customError);
      }
    }

    console.log({ tourServices });
    if (tourServices.length) {
      if ((await serviceRepo.findByIds(tourServices.map((s) => s.id))).length !== tourServices.length) {
        const customError = new CustomError(400, 'General', `One or more tourServices not found`);
        return next(customError);
      }
    }

    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        const newTour = new Tour();
        console.log(new Date(publishDate));
        newTour.title = title;
        newTour.spot = spot;
        newTour.body = body;
        newTour.type = type;
        newTour.publishStatus = publishStatus;
        newTour.publishDate = publishDate;

        const tourCategory = await categoryRepo.findOne({ id: categoryId });
        newTour.category = tourCategory;

        const tourPrice = new TourPrice();
        tourPrice.name = 'Yetişkin';
        tourPrice.description = 'Yetişkin';
        tourPrice.price = Number(price);
        await transactionalEntityManager.save(tourPrice);
        // await priceRepo.save(tourPrice);
        newTour.prices = [];
        newTour.prices.push(tourPrice);

        const tourTags: Tag[] = await tagRepo.findByIds(tags.map((t) => t.id));
        newTour.tags = tourTags;

        const services: TourService[] = [];

        tourServices = tourServices.filter((s) => s.selected !== 'I');
        for (let index = 0; index < tourServices.length; index++) {
          const s = tourServices[index];
          const tourService = new TourService();
          const service = await serviceRepo.findOne({ id: s.id });
          tourService.service = service;
          // tourService.tour = newTour;
          tourService.type = s.selected === 'Y' ? ServiceType.INCLUDED : ServiceType.EXCLUDED;
          services.push(tourService);
        }

        newTour.tourServices = services;

        // save image and gallery to cloudinary and db
        newTour.image = '';
        newTour.gallery = [];

        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');

        const folderDate = `${year}-${month}-${day}_${hour}-${minute}`;

        console.log({ body: req.body });
        console.log({ files: req.files });
        console.log({ image: req.files['image'] });
        console.log({ gallery: req.files['gallery'] });
        if (req.files && req.files['image'] && req.files['image'].length) {
          const imageStr = 'data:image/jpeg;base64,' + req.files['image'][0].buffer.toString('base64');
          await v2.uploader
            .upload(imageStr, { folder: 'tour/' + folderDate })
            .then((result) => {
              newTour.image = result.url;
              console.log({ imageUrl: result.url });
            })
            .catch((err) => {
              throw new CustomError(500, 'General', 'Something went wrong while uploading to cloudinary');
            });
        }

        if (req.files && req.files['gallery'] && req.files['gallery'].length) {
          console.log({ length: req.files['gallery'].length });
          for (let index = 0; index < req.files['gallery'].length; index++) {
            const file = req.files['gallery'][index];
            const imageStr = 'data:image/jpeg;base64,' + file.buffer.toString('base64');
            await v2.uploader
              .upload(imageStr, { folder: 'tour/' + folderDate })
              .then((result) => {
                newTour.gallery.push(result.url);
                console.log({ imageUrl: result.url });
              })
              .catch((err) => {
                throw new CustomError(500, 'General', 'Something went wrong while uploading to cloudinary');
              });
          }
        }

        await transactionalEntityManager.save(newTour);
        return res.customSuccess(200, 'Tour created successfully', newTour);
      });
    } catch (error) {
      const customError = new CustomError(400, 'General', `Tour '${title}' can't be created`, null, error);
      return next(customError);
    }
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
