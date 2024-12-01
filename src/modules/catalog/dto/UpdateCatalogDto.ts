import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PublishStatus } from 'shared/utils/enum';

export class UpdateCatalogDto {
  @IsString()
  @MinLength(3)
  originalName: string;

  @IsEnum(PublishStatus, { message: 'Invalid publish status' })
  publishStatus: PublishStatus = PublishStatus.DRAFT;

  @IsDateString({}, { message: 'Invalid publish date format' })
  publishDate?: string;
}
