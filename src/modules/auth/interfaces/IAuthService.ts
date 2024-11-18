import { TokenResponse, UserResponse } from 'shared/utils/response';
import { RefreshTokenDto, SignInCredentialsDto, SignUpCredentialsDto } from '../dto';

export interface IAuthService {
  signIn(payload: SignInCredentialsDto): Promise<UserResponse>;
  signUp(payload: SignUpCredentialsDto): Promise<void>;
  getAccessToken(refreshToken: RefreshTokenDto): Promise<TokenResponse>;
}
