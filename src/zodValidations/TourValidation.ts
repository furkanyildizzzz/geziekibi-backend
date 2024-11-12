import { PublishStatus, ServiceType, TourType } from 'orm/entities/tour/types';
import { z } from 'zod';
const fileSizeLimit = 5 * 1024 * 1024; // 5MB

export const TourValidationSchema = z.object({
  id: z.number().optional(), // Primary key, autogenerated
  title: z.string().min(1, { message: 'Title is required' }),
  spot: z.string().min(1, { message: 'Spot is required' }),
  body: z.string().optional(), // 'text' type is generally optional in validation
  tourType: z.nativeEnum(TourType).default(TourType.YURTICI),
  publishStatus: z.nativeEnum(PublishStatus).default(PublishStatus.DRAFT),
  startDate: z
    .string()
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: 'Invalid start date format',
    })
    .transform((dateStr) => new Date(dateStr)),
  endDate: z
    .string()
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: 'Invalid end date format',
    })
    .transform((dateStr) => new Date(dateStr)),
  publishDate: z
    .string()
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: 'Invalid publish date format',
    })
    .transform((dateStr) => new Date(dateStr))
    .optional(),
  primaryImages: z.array(z.any()), // Allow an array of any file objects for gallery
  galleryImages: z.array(z.any()).optional(), // Allow an array of any file objects for gallery
  tags: z.array(z.object({ id: z.number() })).optional(), // Assuming `tags` are referenced by `id`
  prices: z
    .array(
      z.object({
        name: z.string({ message: 'Price name required' }).trim(),
        price: z.number().positive({ message: 'Price must be positive' }),
        currency: z.string().min(1, { message: 'Currency is required' }),
      }),
    )
    .optional(),
  category: z.object({ id: z.number(), name: z.string().optional() }).optional(), // Category is referenced by `id`
  tourServices: z.array(
    z.object({
      id: z.preprocess((value) => (typeof value === 'string' ? parseInt(value) : value), z.number()),
      type: z.nativeEnum(ServiceType, {
        message: 'Servie type required',
      }),
      service: z.object({
        id: z.preprocess((value) => (typeof value === 'string' ? parseInt(value) : value), z.number()),
        name: z.string({ message: 'dsada' }).min(1, { message: 'Service name is required' }),
        description: z.string(),
      }),
    }),
  ),
});

export const TourValidationSchemaPostman = z.object({
  id: z.number().optional(), // Primary key, autogenerated
  title: z
    .string({ required_error: 'Title is required' })
    .min(3, { message: 'Title must be at least 3 character long' })
    .trim(),
  spot: z
    .string({ required_error: 'Spot is required' })
    .min(3, { message: 'Spot must be at least 3 character long' })
    .trim(),
  body: z.string().optional(), // 'text' type is generally optional in validation
  type: z.nativeEnum(TourType).default(TourType.YURTICI),
  publishStatus: z.nativeEnum(PublishStatus).default(PublishStatus.DRAFT),
  // publishDate: z
  //   .string()
  //   .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
  //     message: 'Invalid date format',
  //   })
  //   .transform((dateStr) => new Date(dateStr))
  //   .optional(),
  // tags: z.string().optional(), // Assuming `tags` are referenced by `id`
  prices: z
    .array(
      z.object({
        amount: z.number().positive({ message: 'Price amount must be positive' }),
        currency: z.string().min(1, { message: 'Currency is required' }),
      }),
    )
    .optional(),
  // categoryId: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
  //   message: 'Expected number, received a string',
  // }), // Category is referenced by `id`
  // tourServices: z.string().optional(),
});
