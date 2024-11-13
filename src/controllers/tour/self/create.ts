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
import { Image } from 'orm/entities/image/Image';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  console.log({ files: req.files });
  console.log({ file: req.file });
  console.log({ primaryImages: req.files['primaryImages'] });
  console.log({ galleryImages: req.files['galleryImages'] });

  let { title, spot, body, tourType, publishStatus, publishDate, startDate, endDate } = req.body;
  const tags = JSON.parse(req.body.tags);
  const category = JSON.parse(req.body.category);
  const prices = JSON.parse(req.body.prices);
  let tourServices = JSON.parse(req.body.tourServices);

  const id = req.params.id;

  const tourRepo = getRepository(Tour);
  const categoryRepo = getRepository(TourCategory);
  const tagRepo = getRepository(Tag);
  const serviceRepo = getRepository(Service);
  const priceRepo = getRepository(TourPrice);
  const tourServiceRepo = getRepository(TourService);
  try {
    if (id) {
      if (!(await tourRepo.findOne(id))) {
        const customError = new CustomError(400, 'General', `Tour with id:'${id}' not found`);
        return next(customError);
      }
    }

    if (category) {
      if (!(await categoryRepo.findOne(category.id))) {
        const customError = new CustomError(400, 'General', `Category with id:'${category.id}' not found`);
        return next(customError);
      }
    }

    if (tags.length) {
      if ((await tagRepo.findByIds(tags.map((t) => t.id))).length !== tags.length) {
        const customError = new CustomError(400, 'General', `One or more tags not found`);
        return next(customError);
      }
    }

    if (tourServices.length) {
      if ((await serviceRepo.findByIds(tourServices.map((s) => s.service.id))).length !== tourServices.length) {
        const customError = new CustomError(400, 'General', `One or more services not found`);
        return next(customError);
      }
    }

    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        const newTour = Number(id) > 0 ? await tourRepo.findOne(id) : new Tour();
        newTour.title = title;
        newTour.spot = spot;
        newTour.body = body;
        newTour.tourType = tourType;
        newTour.publishStatus = publishStatus;
        newTour.publishDate = publishDate;
        newTour.startDate = startDate;
        newTour.endDate = endDate;

        if (id) {
          newTour.updated_at = new Date();
        }
        const tourCategory = await categoryRepo.findOne({ id: category.id });
        newTour.category = tourCategory;

        const tourTags: Tag[] = await tagRepo.findByIds(tags.map((t) => t.id));
        newTour.tags = tourTags;

        const newTourServices: TourService[] = [];
        tourServices = tourServices.filter((s) => (s.type as ServiceType) !== ServiceType.INHERIT);
        for (let index = 0; index < tourServices.length; index++) {
          const s = tourServices[index];
          const tourService = await tourServiceRepo.findOne({ id: s.id });
          if (tourService) {
            tourService.type = s.type as ServiceType;
            newTourServices.push(tourService);
          } else {
            const newTourService = new TourService();
            const service = await serviceRepo.findOne({ id: s.service.id });
            newTourService.service = service;
            // tourService.tour = newTour;
            newTourService.type = s.type as ServiceType;
            newTourServices.push(newTourService);
          }
        }
        newTour.tourServices = newTourServices;

        const tourPrices: TourPrice[] = [];
        for (let index = 0; index < prices.length; index++) {
          const p = prices[index];
          const tourPrice = new TourPrice();
          tourPrice.name = p.name;
          tourPrice.currency = p.currency;
          tourPrice.description = p.description;
          tourPrice.price = Number(p.price);
          await transactionalEntityManager.save(tourPrice);
          tourPrices.push(tourPrice);
        }
        newTour.prices = tourPrices;

        await transactionalEntityManager.save(newTour).catch((error) => {
          console.log({ DatabaseError: error });
          const customError = new CustomError(400, 'Raw', 'Database error', null, error);
          throw customError;
        });

        //#region Images
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(now.getDate()).padStart(2, '0');
        // const hour = String(now.getHours()).padStart(2, '0');
        // const minute = String(now.getMinutes()).padStart(2, '0');

        const folderDate = `${year}-${month}-${day}`; //_${hour}-${minute};
        const primaryImages: Image[] = [];
        const galleryImages: Image[] = [];

        console.log({ newTour });
        if (req.files && req.files['primaryImages'] && req.files['primaryImages'].length) {
          const imageStr = 'data:image/jpeg;base64,' + req.files['primaryImages'][0].buffer.toString('base64');
          await v2.uploader
            .upload(imageStr, { folder: 'tour/' + folderDate + '/' + id })
            .then(async (result) => {
              const newImage = new Image();
              newImage.publicId = result.public_id;
              newImage.url = result.url;
              newImage.secureUrl = result.secure_url;
              newImage.format = result.format;
              newImage.width = result.width;
              newImage.height = result.height;
              newImage.createdAt = new Date(result.created_at);
              newImage.primaryForTour = newTour;
              await transactionalEntityManager.save(newImage);
              primaryImages.push(newImage);

              console.log({ imageUrl: result.url });
            })
            .catch((err) => {
              throw new CustomError(500, 'General', 'Something went wrong while uploading to cloudinary');
            });
        }

        if (req.files && req.files['galleryImages'] && req.files['galleryImages'].length) {
          for (let index = 0; index < req.files['galleryImages'].length; index++) {
            const file = req.files['galleryImages'][index];
            const imageStr = 'data:image/jpeg;base64,' + file.buffer.toString('base64');
            await v2.uploader
              .upload(imageStr, { folder: 'tour/' + folderDate + '/' + id })
              .then(async (result) => {
                const newImage = new Image();
                newImage.publicId = result.public_id;
                newImage.url = result.url;
                newImage.secureUrl = result.secure_url;
                newImage.format = result.format;
                newImage.width = result.width;
                newImage.height = result.height;
                newImage.createdAt = new Date(result.created_at);
                newImage.tour = newTour;
                await transactionalEntityManager.save(newImage);
                galleryImages.push(newImage);
                console.log({ imageUrl: result.url });
              })
              .catch((err) => {
                throw new CustomError(500, 'General', 'Something went wrong while uploading to cloudinary');
              });
          }
        }

        // newTour.primaryImages = primaryImages;
        // newTour.galleryImages = galleryImages;
        //#endregion

        // await transactionalEntityManager.save(primaryImages);
        // await transactionalEntityManager.save(galleryImages);

        return res.customSuccess(200, `Tour ${id ? 'edited' : 'created'} successfully`, newTour);
      });
    } catch (error) {
      const customError = new CustomError(
        400,
        'General',
        `Tour '${title}' can't be ${id ? 'edited' : 'created'}`,
        null,
        error,
      );
      return next(customError);
    }
  } catch (error) {
    const customError = new CustomError(400, 'Raw', 'Error', null, error);
    return next(customError);
  }
};
