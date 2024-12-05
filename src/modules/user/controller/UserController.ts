import { INTERFACE_TYPE } from 'core/types';
import { inject, injectable } from 'inversify';
import { IUserService } from '../interfaces/IUserService';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { NextFunction, Request, Response } from 'express';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { UserEditProfileDto } from '../dto/UserEditProfileDto';
import { ChangePasswordDto } from '../dto/ChangePasswordDto';
import { uploadMiddleware } from 'middleware/multer';
import { DeleteProfileImageDto } from '../dto/DeleteProfileImageDto';

@controller('/panel/user')
export class UserController {
  constructor(@inject(INTERFACE_TYPE.IUserService) private readonly service: IUserService) {}

  @httpGet('/')
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const users = await this.service.getAll();
    return res.customSuccess(200, 'Users', users);
  }

  @httpGet('/:id([0-9]+)')
  public async getById(req: Request, res: Response, next: NextFunction) {
    const user = await this.service.getById(req.params.id);
    return res.customSuccess(200, 'User found', user);
  }

  @httpGet('/profile/', checkJwt)
  public async getProfile(req: Request, res: Response, next: NextFunction) {
    const user = await this.service.getUserEditProfile(req.jwtPayload.id);
    return res.customSuccess(200, 'User profile', user);
  }

  @httpPost('/profile/', checkJwt, DtoValidationMiddleware(UserEditProfileDto))
  public async updateProfile(req: Request, res: Response, next: NextFunction) {
    const user = await this.service.updateUserProfile(req.jwtPayload.id, req.body);
    return res.customSuccess(200, 'User profile updated successfully', user);
  }

  @httpPost('/changePassword/', checkJwt, DtoValidationMiddleware(ChangePasswordDto))
  public async changePassword(req: Request, res: Response, next: NextFunction) {
    await this.service.changePassword(req.jwtPayload.id, req.body);
    return res.customSuccess(200, 'User profile updated successfully, please login again');
  }

  @httpPost('/uploadProfileImage/', checkJwt, uploadMiddleware)
  public async uploadProfileImage(req: Request, res: Response, next: NextFunction) {
    const image = await this.service.uploadProfileImage(req.jwtPayload.id, req.files as Express.Multer.File[]);
    return res.customSuccess(200, 'User profile image uploaded successfully', image);
  }

  @httpPost('/deleteProfileImage/', checkJwt, DtoValidationMiddleware(DeleteProfileImageDto, true))
  public async deleteProfileImage(req: Request, res: Response, next: NextFunction) {
    await this.service.deleteProfileImage(req.body);
    return res.customSuccess(200, 'User profile image deleted successfully');
  }
}
