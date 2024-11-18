import { IsNumber } from 'class-validator';

export class DeleteMultipleTagDto {
  @IsNumber({}, { each: true })
  ids: number[];
}
