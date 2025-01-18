import { Expose } from 'class-transformer';

export class FAQsDto {
  @Expose()
  id: number;
  @Expose()
  Question: string;
  @Expose()
  Answer: string;
  @Expose()
  Order: number;
}
