import { UserResponse, TokenResponse } from 'shared/utils/response';
import { SignInCredentialsDto, SignUpCredentialsDto, RefreshTokenDto } from '../dto';
import { IAuthService } from '../interfaces/IAuthService';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import { BadRequestException, InternalServerErrorException } from 'shared/errors/allException';
import { JwtPayload } from 'types/JwtPayload';
import { Role } from 'orm/entities/users/types';
import { createJwtToken } from 'shared/utils/createJwtToken';
import { User } from 'orm/entities/users/User';
import { ISeoLinkService } from 'shared/interfaces/ISeoLinkService';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(INTERFACE_TYPE.IAuthRepository) private readonly repository: IAuthRepository,
    @inject(INTERFACE_TYPE.ISeoLinkService) private readonly seoLinkService: ISeoLinkService,
  ) {}

  async signIn(payload: SignInCredentialsDto): Promise<UserResponse> {
    const { email, password } = payload;

    try {
      const user = await this.repository.getByEmail(email);

      if (!user) {
        const customError = new BadRequestException('Incorrect email or password');
        throw customError;
      }

      if (!user.checkIfPasswordMatch(password)) {
        const customError = new BadRequestException('Incorrect email or password');
        throw customError;
      }

      const jwtPayload: JwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Role,
        created_at: user.created_at,
      };

      try {
        const token = createJwtToken(jwtPayload);
        const response = new UserResponse();
        response.accessToken = token;
        response.user = user;
        return response;
      } catch (err) {
        const customError = new BadRequestException(`Token can't be created`);
        throw customError;
      }
    } catch (err) {
      const customError = new InternalServerErrorException(err.message);
      throw customError;
    }
  }

  async signUp(payload: SignUpCredentialsDto): Promise<void> {
    const { email, password, firstName, lastName } = payload;

    try {
      const user = await this.repository.getByEmail(email);

      if (user) {
        const customError = new BadRequestException(`Email '${user.email}' already exists`);
        throw customError;
      }

      try {
        const newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.hashPassword();
        newUser.seoLink = await this.seoLinkService.generateUniqueSeoLink(newUser.name, 'user', newUser.id);

        await this.repository.save(newUser);
      } catch (err) {
        const customError = new InternalServerErrorException(`User '${email}' can't be created. Error: ${err.message}`);
        throw customError;
      }
    } catch (err) {
      const customError = new InternalServerErrorException(err.message);
      throw customError;
    }
  }

  getAccessToken(refreshToken: RefreshTokenDto): Promise<TokenResponse> {
    throw new Error('Method not implemented.');
  }
}
