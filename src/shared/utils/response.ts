import { User } from 'orm/entities/users/User';

export class UserResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export class TokenResponse {
  accessToken: string;
  refreshToken: string;
}
