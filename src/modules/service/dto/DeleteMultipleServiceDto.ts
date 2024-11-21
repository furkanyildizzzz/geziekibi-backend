import { IsNumber } from 'class-validator';

export class DeleteMultipleServiceDto {
  @IsNumber({}, { each: true })
  ids: number[];
}
