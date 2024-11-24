import { inject, injectable } from 'inversify';
import { IUserService } from '../interfaces/IUserService';
import { UserDto } from '../dto/UserDto';
import { UserEditProfileDto } from '../dto/UserEditProfileDto';
import { UserListDto } from '../dto/UserListDto';
import { INTERFACE_TYPE } from 'core/types';
import { IUserRepository } from '../interfaces/IUserRepository';
import { plainToInstance } from 'class-transformer';
import { BadRequestException, InternalServerErrorException, NotFoundException } from 'shared/errors/allException';
import { UserAddress } from 'orm/entities/users/UserAddress';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { UserProfileDto } from '../dto/UserProfileDto';
import { ChangePasswordDto } from '../dto/ChangePasswordDto';
import { Image } from 'orm/entities/image/Image';
import { v2 } from 'cloudinary';
import { DeleteProfileImageDto } from '../dto/DeleteProfileImageDto';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(INTERFACE_TYPE.IUserRepository) private readonly repository: IUserRepository,
    @inject(INTERFACE_TYPE.UnitOfWork) private readonly unitOfWork: UnitOfWork,
  ) {}

  public async getAll(): Promise<UserListDto[]> {
    const users = await this.repository.getAll();
    if (users && users.length)
      return plainToInstance(UserListDto, users, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    return [];
  }

  public async getById(id: string): Promise<UserDto> {
    const user = await this.repository.getById(Number(id));
    if (!user) throw new NotFoundException(`User with id:${id} not found`);
    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async getUserEditProfile(id: number): Promise<UserProfileDto> {
    const user = await this.repository.getById(Number(id));
    if (!user) throw new NotFoundException(`User with id:${id} not found`);
    return plainToInstance(UserProfileDto, user, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  public async updateUserProfile(id: number, userData: UserEditProfileDto): Promise<UserProfileDto> {
    const userAddressRepository = await this.unitOfWork.getRepository(UserAddress);
    const user = await this.repository.getById(Number(id));
    if (!user) throw new NotFoundException(`User with id:${id} not found`);

    try {
      const userAddress =
        (await userAddressRepository.findOne({ where: { user: { id: user.id } } })) || new UserAddress();

      user.firstName = userData.firstName;
      user.lastName = userData.lastName;
      user.bio = userData.bio;

      userAddress.secondEmail = userData.secondEmail;
      userAddress.website = userData.website;
      userAddress.address = userData.address;
      userAddress.city = userData.city;
      userAddress.zipCode = userData.zipCode;
      userAddress.country = userData.country;

      user.address = userAddress;

      await this.repository.update(id, user);

      return plainToInstance(UserProfileDto, user, {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async changePassword(id: number, data: ChangePasswordDto): Promise<void> {
    const user = await this.repository.getById(Number(id));
    if (!user) throw new NotFoundException(`User with id:${id} not found`);

    try {
      user.password = data.newPassword;
      user.hashPassword();
      await this.repository.update(id, user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async deleteUser(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async uploadProfileImage(id: number, files: Express.Multer.File[]): Promise<Image> {
    const user = await this.repository.getById(Number(id));
    if (!user) throw new NotFoundException(`User with id:${id} not found`);

    if (files && files['profileImage'] && files['profileImage'].length) {
      const newImage = new Image();
      const imageStr = 'data:image/jpeg;base64,' + files['profileImage'][0].buffer.toString('base64');
      await v2.uploader
        .upload(imageStr, { folder: `${process.env.NODE_ENV}/user/${id}/profileImage` })
        .then(async (result) => {
          newImage.publicId = result.public_id;
          newImage.url = result.url;
          newImage.secureUrl = result.secure_url;
          newImage.format = result.format;
          newImage.width = result.width;
          newImage.height = result.height;
          newImage.createdAt = new Date(result.created_at);

          return plainToInstance(Image, newImage, {
            excludeExtraneousValues: true,
            enableCircularCheck: true,
          });
          console.log({ imageUrl: result.url });
        })
        .catch((error) => {
          throw new InternalServerErrorException(error.message);
        });
      user.profileImage = newImage;
      await this.repository.update(id, user);
      return newImage;
    }
    throw new BadRequestException('No profile image file found');
  }

  public async deleteProfileImage(data: DeleteProfileImageDto): Promise<void> {
    const imageRepository = await this.unitOfWork.getRepository(Image);
    const image = await imageRepository.findOne({ where: { publicId: data.publicId } });
    if (image) await imageRepository.delete(image.id);
  }
}
