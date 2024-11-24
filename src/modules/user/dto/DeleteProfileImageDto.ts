import { IsString } from 'class-validator';

export class DeleteProfileImageDto {
  @IsString({ message: 'Please provide a public id to delete' })
  publicId: string;
}
