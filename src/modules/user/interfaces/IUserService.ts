import { Image } from 'orm/entities/image/Image';
import { ChangePasswordDto } from '../dto/ChangePasswordDto';
import { UserDto } from '../dto/UserDto';
import { UserEditProfileDto } from '../dto/UserEditProfileDto';
import { UserListDto } from '../dto/UserListDto';
import { UserProfileDto } from '../dto/UserProfileDto';
import { DeleteProfileImageDto } from '../dto/DeleteProfileImageDto';

export interface IUserService {
  getAll(): Promise<UserListDto[]>;
  getById(id: string): Promise<UserDto>;
  getBySeoLink(seoLink: string): Promise<UserDto>;
  getUserEditProfile(id: number): Promise<UserProfileDto>;
  updateUserProfile(id: number, userData: UserEditProfileDto): Promise<UserProfileDto>;
  changePassword(id: number, data: ChangePasswordDto): Promise<void>;
  deleteUser(id: number): Promise<void>;
  uploadProfileImage(id: number, files: Express.Multer.File[]): Promise<Image>;
  deleteProfileImage(data: DeleteProfileImageDto): Promise<void>;
}
