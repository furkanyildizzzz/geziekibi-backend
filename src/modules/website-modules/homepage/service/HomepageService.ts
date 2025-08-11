import { inject, injectable } from 'inversify';
import { FeaturedCategoryDto, FeaturedTourDto } from '../dto/FeaturedTourDto';
import { IHomepageService } from '../interfaces/IHomepageService';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { Tour } from 'orm/entities/tour/Tour';
import { IsNull, LessThan, LessThanOrEqual } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import tourFunctions from 'shared/utils/tourFunctions';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { Currency, EmailTemplateEnum, PublishStatus, StaticPageType } from 'shared/utils/enum';
import { BlogDto } from '../dto/BlogDto';
import { Blog } from 'orm/entities/blog/Blog';
import { DailyPathDto } from '../dto/DailyPathDto';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { CategoryDto } from '../dto/CategoryDto';
import { StaticPageDto } from '../dto/StaticPageDto';
import { StaticPage } from 'orm/entities/static-page/StaticPage';
import { CreateContactFormDto } from '../dto/CreateContactFormDto';
import { InternalServerErrorException } from 'shared/errors/allException';
import { ContactForm } from 'orm/entities/contactForm/ContactForm';
import { FAQsDto } from '../dto/FAQsDto';
import { FAQ } from 'orm/entities/faq/FAQ';
import { SliderDto } from '../dto/SliderDto';
import { HomepageSlider } from 'orm/entities/homepageSlider/HomepageSlider';
import { EmailService } from 'shared/services/EmailService';
import { CatalogDto } from '../dto/CatalogDto';
import { Catalog } from 'orm/entities/catalog/Catalog';
import { MonthDTO, TourDTO, TravelCalendarDto, YearDTO } from '../dto/TravelCalendarDto';

@injectable()
export class HomepageService implements IHomepageService {
  constructor(
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
    @inject(INTERFACE_TYPE.IEmailService) private readonly emailService: EmailService,
  ) { }

  public async getFeaturedTours(): Promise<FeaturedTourDto[]> {
    const tourRepo = await this.unitOfWork.getRepository(Tour);

    // const today = new Date();
    // const tours = await tourRepo.find({
    //   where: { tourDates: { startDate: LessThanOrEqual(today) }, publishStatus: PublishStatus.PUBLISH, },
    //   order: {
    //     tourDates: {
    //       startDate: 'DESC',
    //     },
    //   },
    //   take: 3,
    //   relations: ['tourDates', 'tourDates.prices', 'primaryImages', 'category', 'category.tours'],
    // });

    const today = new Date();

    const query = await tourRepo
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.tourDates', 'tourDates')
      .leftJoinAndSelect('tourDates.prices', 'prices')
      .leftJoinAndSelect('tour.primaryImages', 'primaryImages')
      .leftJoinAndSelect('tour.category', 'category')
      .leftJoinAndSelect('category.tours', 'categoryTours')
      .where('tourDates.startDate <= :today', { today })
      .andWhere('tour.publishStatus = :publishStatus', { publishStatus: PublishStatus.PUBLISH })
      .andWhere('tour.publishDate <= :today', { today })
      .andWhere((qb) => {
        const subQuery = qb.subQuery().select('user.id').from('users', 'user').where('user.role = :role').getQuery();
        return `tour.insertUserId IN ${subQuery}`;
      })
      .setParameter('role', 'ADMINISTRATOR')
      .orderBy('tourDates.startDate', 'DESC')
      .take(3);

    console.log('getfeaturedtours', query.getQueryAndParameters());
    const tours = await query.getMany();

    const toursWithMostRecentDate = tours.map((tour) => {
      const mostRecentDate = tour.tourDates.reduce((latest, current) => {
        return current.startDate > latest.startDate ? current : latest;
      }, tour.tourDates[0]);

      return {
        ...tour,
        dates: [{ ...mostRecentDate, prices: [mostRecentDate?.prices.sort((a, b) => a.id - b.id)[0]] }], // Include only the most recent date
      };
    });

    const featuredTours = toursWithMostRecentDate.map((tour) => {
      const featuredTour = new FeaturedTourDto();
      featuredTour.id = tour.id;
      featuredTour.title = tour.title;
      featuredTour.seoLink = tour.seoLink;
      featuredTour.startDate = tour.startDate;
      featuredTour.endDate = tour.endDate;
      featuredTour.pricePerPerson = tour.dates[0]?.prices[0]?.price;
      featuredTour.currency = tour.dates[0]?.prices[0]?.currency;
      featuredTour.tourDates = tour.dates;
      featuredTour.uploadedPrimaryImages = tour.primaryImages;
      featuredTour.category = { ...tour.category, tourCount: tour.category.tours.length };
      const { days, nights } = tourFunctions.calculateDaysAndNights(tour.startDate, tour.endDate);
      const daysAndNights = `${nights} gece/${days} gün`;
      featuredTour.daysAndNights = daysAndNights;

      return featuredTour;
    });

    return plainToInstance(FeaturedTourDto, featuredTours, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getCategories(): Promise<CategoryDto[]> {
    const categoryRepo = await this.unitOfWork.getRepository(TourCategory);
    const today = new Date(); // Bugünün tarihi

    // const categories = await categoryRepo.find({
    //   where:{tours:{insertUserId}},
    //   relations: ['parent', 'subCategories', 'primaryImages', 'tours', 'tours.tourDates', 'subCategories.tours', 'subCategories.tours.tourDates'],
    // });

    const categories = await categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .leftJoinAndSelect('category.subCategories', 'subCategories')
      .leftJoinAndSelect('category.primaryImages', 'primaryImages')
      .leftJoinAndSelect('category.tours', 'tours')
      .leftJoinAndSelect('tours.tourDates', 'tourDates')
      .leftJoinAndSelect('subCategories.tours', 'subTours')
      .leftJoinAndSelect('subTours.tourDates', 'subTourDates')
      .andWhere('tour.publishDate <= :today', { today })
      .orWhere('subTours.publishDate <= :today', { today }) // publishDate koşulu subTours için
      .where((qb) => {
        const subQuery = qb.subQuery().select('user.id').from('users', 'user').where('user.role = :role').getQuery();
        return `tours.insertUserId IN ${subQuery} OR subTours.insertUserId IN ${subQuery}`; // Her iki tur tablosu için koşul
      })
      .setParameter('role', 'ADMINISTRATOR')
      .getMany();

    const calculateTourCount = (category: TourCategory): number => {
      // Count tours in the current category
      let tourCount =
        category.tours === undefined || category.tours.length === 0
          ? 0
          : category.tours.filter(
            (tour) => tour.publishStatus === 'publish',
            // &&
            // tour.tourDates?.some((tourDate) => new Date(tourDate.startDate) >= today),
          ).length;

      // Add tour counts from subcategories
      if (category.subCategories && category.subCategories.length > 0) {
        tourCount += category.subCategories.reduce((count, subCategory) => count + calculateTourCount(subCategory), 0);
      }

      return tourCount;
    };

    const parentCategoriesWithPublishedTourCount = categories
      .map((category) => ({
        ...category,
        uploadedPrimaryImages: category.primaryImages,
        tourCount: calculateTourCount(category), // Calculate total tour count recursively
      }))
      .filter((s) => s.parent === null);

    return plainToInstance(CategoryDto, parentCategoriesWithPublishedTourCount, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getTopTours(): Promise<FeaturedTourDto[]> {
    const tourRepo = await this.unitOfWork.getRepository(Tour);

    // const today = new Date();
    // const tours = await tourRepo.find({
    //   where: { tourDates: { startDate: LessThanOrEqual(today) }, publishStatus: PublishStatus.PUBLISH },
    //   order: {
    //     tourDates: {
    //       startDate: 'DESC',
    //     },
    //   },
    //   take: 6,
    //   relations: ['tourDates', 'tourDates.prices', 'primaryImages', 'category', 'category.tours'],
    // });

    const today = new Date();

    const query = await tourRepo
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.tourDates', 'tourDates')
      .leftJoinAndSelect('tourDates.prices', 'prices')
      .leftJoinAndSelect('tour.primaryImages', 'primaryImages')
      .leftJoinAndSelect('tour.category', 'category')
      .leftJoinAndSelect('category.tours', 'categoryTours')
      .where('tourDates.startDate <= :today', { today })
      .andWhere('tour.publishStatus = :publishStatus', { publishStatus: PublishStatus.PUBLISH })
      .andWhere('tour.publishDate <= :today', { today })
      .andWhere((qb) => {
        const subQuery = qb.subQuery().select('user.id').from('users', 'user').where('user.role = :role').getQuery();
        return `tour.insertUserId IN ${subQuery}`;
      })
      .setParameter('role', 'ADMINISTRATOR')
      .orderBy('tourDates.startDate', 'DESC')
      .take(6);

    console.log('getfeaturedtours', query.getQueryAndParameters());
    const tours = await query.getMany();

    const toursWithMostRecentDate = tours.map((tour) => {
      const mostRecentDate = tour.tourDates.reduce((latest, current) => {
        return current.startDate > latest.startDate ? current : latest;
      }, tour.tourDates[0]);

      return {
        ...tour,
        dates: [{ ...mostRecentDate, prices: [mostRecentDate?.prices.sort((a, b) => a.id - b.id)[0]] }], // Include only the most recent date
      };
    });

    const featuredTours = toursWithMostRecentDate.map((tour) => {
      const featuredTour = new FeaturedTourDto();
      featuredTour.id = tour.id;
      featuredTour.title = tour.title;
      featuredTour.seoLink = tour.seoLink;
      featuredTour.startDate = tour.startDate;
      featuredTour.endDate = tour.endDate;
      featuredTour.pricePerPerson = tour.dates[0]?.prices[0]?.price;
      featuredTour.currency = tour.dates[0]?.prices[0]?.currency;
      featuredTour.tourDates = tour.dates;
      featuredTour.uploadedPrimaryImages = tour.primaryImages;
      featuredTour.category = { ...tour.category, tourCount: tour.category.tours.length };

      const { days, nights } = tourFunctions.calculateDaysAndNights(tour.startDate, tour.endDate);
      const daysAndNights = `${nights} gece/${days} gün`;
      featuredTour.daysAndNights = daysAndNights;

      return featuredTour;
    });

    return plainToInstance(FeaturedTourDto, featuredTours, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getBlogs(): Promise<BlogDto[]> {
    const blogRepo = await this.unitOfWork.getRepository(Blog);

    // const today = new Date();
    // const blogs = await blogRepo.find({
    //   where: { publishDate: LessThanOrEqual(today), publishStatus: PublishStatus.PUBLISH },
    //   order: {
    //     publishDate: 'DESC',
    //   },
    //   take: 6,
    //   relations: ['tags', 'primaryImages', 'category'],
    // });

    const today = new Date();

    const blogs = await blogRepo
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.tags', 'tags')
      .leftJoinAndSelect('blog.primaryImages', 'primaryImages')
      .leftJoinAndSelect('blog.category', 'category')
      .where('blog.publishDate <= :today', { today })
      .andWhere('blog.publishStatus = :publishStatus', { publishStatus: PublishStatus.PUBLISH })
      .andWhere((qb) => {
        const subQuery = qb.subQuery().select('user.id').from('users', 'user').where('user.role = :role').getQuery();
        return `blog.insertUserId IN ${subQuery}`;
      })
      .setParameter('role', 'ADMINISTRATOR')
      .orderBy('blog.publishDate', 'DESC')
      .take(6)
      .getMany();

    const blogList = blogs.map((b) => {
      const blog = new BlogDto();
      blog.id = b.id;
      blog.title = b.title;
      blog.seoLink = b.seoLink;
      blog.publishDate = b.publishDate;
      blog.comments = 6;
      blog.uploadedPrimaryImages = b.primaryImages;
      blog.tags = b.tags;
      blog.category = b.category;
      return blog;
    });

    return plainToInstance(BlogDto, blogList, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getDailyPaths(): Promise<DailyPathDto[]> {
    const repo = await this.unitOfWork.getRepository(TourDailyPath);

    // const dailyPaths = await repo.find();

    const dailyPaths = await repo
      .createQueryBuilder('dailyPath')
      .where((qb) => {
        const subQuery = qb.subQuery().select('user.id').from('users', 'user').where('user.role = :role').getQuery();
        return `dailyPath.insertUserId IN ${subQuery}`;
      })
      .setParameter('role', 'ADMINISTRATOR')
      .getMany();

    return plainToInstance(DailyPathDto, dailyPaths, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getStaticPage(pageType: StaticPageType): Promise<StaticPageDto> {
    const repo = await this.unitOfWork.getRepository(StaticPage);

    // const staticPage = (await repo.find({ where: { pageType: pageType } })).at(0);

    const staticPage = await repo
      .createQueryBuilder('staticPage')
      .where('staticPage.pageType = :pageType', { pageType })
      .andWhere((qb) => {
        const subQuery = qb.subQuery().select('user.id').from('users', 'user').where('user.role = :role').getQuery();
        return `staticPage.insertUserId IN ${subQuery}`;
      })
      .setParameter('role', 'ADMINISTRATOR')
      .getOne();

    return plainToInstance(StaticPageDto, staticPage, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async createContactForm(contactFormDto: CreateContactFormDto): Promise<boolean> {
    const repo = await this.unitOfWork.getRepository(ContactForm);
    try {
      const contactForm = new ContactForm();
      contactForm.firstName = contactFormDto.firstName;
      contactForm.lastName = contactFormDto.lastName;
      contactForm.email = contactFormDto.email;
      contactForm.phone = contactFormDto.phone;
      contactForm.message = contactFormDto.message;
      contactForm.agreeToTerms = contactFormDto.agreeToTerms;
      await repo.save(contactForm);

      await this.emailService.sendEmail(process.env.SMTP_EMAIL, EmailTemplateEnum.ADMIN_CONTACT_NOTIFICATION, {
        name: contactForm.fullName,
        message: contactForm.message,
      });

      await this.emailService.sendEmail(contactForm.email, EmailTemplateEnum.USER_CONTACT_FORM_RECEIVED, {
        name: contactForm.fullName,
        message: contactForm.message,
      });

      return true;
    } catch (error) {
      throw new InternalServerErrorException('internal_server_error', { error: error.message });
    }
  }

  public async getFAQs(): Promise<FAQsDto[]> {
    const repo = await this.unitOfWork.getRepository(FAQ);

    // const faqs = await repo.find();

    const faqs = await repo
      .createQueryBuilder('faq')
      .where((qb) => {
        const subQuery = qb.subQuery().select('user.id').from('users', 'user').where('user.role = :role').getQuery();
        return `faq.insertUserId IN ${subQuery}`;
      })
      .setParameter('role', 'ADMINISTRATOR')
      .getMany();

    return plainToInstance(FAQsDto, faqs, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getHomepageSliders(): Promise<SliderDto[]> {
    const homepageSliderRepo = await this.unitOfWork.getRepository(HomepageSlider);

    // const today = new Date();
    // const sliders = await homepageSliderRepo.find({
    //   where: { isActive: true },
    //   order: {
    //     order: 'ASC',
    //   },
    //   relations: ['image'],
    // });

    const sliders = await homepageSliderRepo
      .createQueryBuilder('slider')
      .leftJoinAndSelect('slider.image', 'image') // 'image' ilişkisini ekliyoruz
      .where('slider.isActive = :isActive', { isActive: true })
      .andWhere((qb) => {
        const subQuery = qb.subQuery().select('user.id').from('users', 'user').where('user.role = :role').getQuery();
        return `slider.insertUserId IN ${subQuery}`;
      })
      .setParameter('role', 'ADMINISTRATOR')
      .orderBy('slider.order', 'ASC')
      .getMany();

    const sliderList = sliders.map((s) => {
      const slider = new SliderDto();
      slider.id = s.id;
      slider.isActive = s.isActive;
      slider.image = s.image;
      slider.order = s.order;
      return slider;
    });

    return plainToInstance(SliderDto, sliderList, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getCatalogs(): Promise<CatalogDto[]> {
    const catalogRepo = await this.unitOfWork.getRepository(Catalog);

    const catalogs = await catalogRepo
      .createQueryBuilder('catalog')
      .where('catalog.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere((qb) => {
        const subQuery = qb.subQuery().select('user.id').from('users', 'user').where('user.role = :role').getQuery();
        return `catalog.insertUserId IN ${subQuery}`;
      })
      .setParameter('role', 'ADMINISTRATOR')
      .orderBy('catalog.order', 'ASC')
      .getMany();

    console.log({ catalogs });

    return plainToInstance(CatalogDto, catalogs, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getTravelCalendar(): Promise<TravelCalendarDto> {
    const tourRepo = await this.unitOfWork.getRepository(Tour);
    const today = new Date();

    const tours = await tourRepo
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.tourDates', 'tourDates')
      .leftJoinAndSelect('tourDates.prices', 'prices')
      // .leftJoinAndSelect('tour.primaryImages', 'primaryImages')
      // .leftJoinAndSelect('tour.category', 'category')
      // .leftJoinAndSelect('category.tours', 'categoryTours')
      .where('tourDates.startDate >= :today', { today })
      // .andWhere('tour.publishStatus = :publishStatus', { publishStatus: PublishStatus.PUBLISH })
      // .andWhere('tour.publishDate <= :today', { today })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('user.id')
          .from('users', 'user')
          .where('user.role = :role')
          .getQuery();
        return `tour.insertUserId IN ${subQuery}`;
      })
      .setParameter('role', 'ADMINISTRATOR')
      .orderBy('tourDates.startDate', 'ASC')
      .getMany();

    console.log(tours)

    // 1️⃣ Verileri Year / Month gruplarına ayır
    const groupedByYear = new Map<number, Map<number, Tour[]>>();

    for (const tour of tours) {
      for (const date of tour.tourDates) {
        const year = date.startDate.getFullYear();
        const month = date.startDate.getMonth() + 1;

        if (!groupedByYear.has(year)) {
          groupedByYear.set(year, new Map<number, Tour[]>());
        }

        if (!groupedByYear.get(year)!.has(month)) {
          groupedByYear.get(year)!.set(month, []);
        }

        groupedByYear.get(year)!.get(month)!.push(tour);
      }
    }

    // 2️⃣ DTO yapısına dönüştür
    const yearsDto: YearDTO[] = [];

    for (const [year, monthsMap] of groupedByYear) {
      const monthsDto: MonthDTO[] = [];

      for (const [month, monthTours] of monthsMap) {
        const toursDto: TourDTO[] = monthTours.map((tour) => {
          const earliestDate = tour.tourDates.sort(
            (a, b) => a.startDate.getTime() - b.startDate.getTime()
          )[0];

          const priceObj = earliestDate?.prices.sort((a, b) => a.id - b.id)[0];

          return {
            departureDate: earliestDate?.startDate.toISOString(),
            returnDate: earliestDate?.endDate.toISOString(),
            durationDays: tourFunctions.calculateDaysAndNights(
              earliestDate.startDate,
              earliestDate.endDate
            ).days,
            tourName: tour.title,
            seoLink: tour.seoLink,
            price: {
              amount: priceObj?.price ?? 0,
              currency: priceObj?.currency ?? Currency.TRY
            }
          };
        });

        monthsDto.push({
          month,
          tours: toursDto
        });
      }

      yearsDto.push({
        year,
        months: monthsDto
      });
    }

    // 3️⃣ TravelCalendarDto oluştur
    const calendar: TravelCalendarDto = {
      years: yearsDto,
    };

    return plainToInstance(TravelCalendarDto, calendar, {
      excludeExtraneousValues: true,
      enableCircularCheck: true
    });
  }

}
