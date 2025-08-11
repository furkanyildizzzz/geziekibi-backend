import { Expose, Type } from 'class-transformer';

export class PriceDTO {
  @Expose()
  amount: number;
  @Expose()
  currency: string;
}

export class TourDTO {
  @Expose()
  departureDate: string;  // ISO format
  @Expose()
  returnDate: string;     // ISO format
  @Expose()
  durationDays: number;
  @Expose()
  tourName: string;
  @Expose()
  seoLink: string;
  @Expose()
  price: PriceDTO;
}

export class MonthDTO {
  @Expose()
  month: number;  // 1-12
  @Expose()
  tours: TourDTO[];
}

export class YearDTO {
  @Expose()
  year: number;  // 1-12
  @Expose()
  months: MonthDTO[];
}

export class TravelCalendarDto {
  @Expose()
  years: YearDTO[];
}
