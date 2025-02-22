import { INTERFACE_TYPE } from 'core/types';
import { inject } from 'inversify';
import { controller, httpPost, requestBody } from 'inversify-express-utils';
import { AuthService } from '../service/AuthService';
import { DtoValidationMiddleware } from 'middleware/dtoValidation';
import { SignInCredentialsDto, SignUpCredentialsDto } from '../dto';
import { Request, Response } from 'express';
import { instanceToPlain } from 'class-transformer';

@controller('/panel/auth')
export class AuthController {
  constructor(@inject(INTERFACE_TYPE.IAuthService) private readonly authService: AuthService) {}

  @httpPost('/signup', DtoValidationMiddleware(SignUpCredentialsDto))
  public async signup(@requestBody() body: SignUpCredentialsDto, req: Request, res: Response) {
    const msg = await this.authService.signUp(body);
    return res.customSuccess(200, 'User registered successfully', msg);
  }

  @httpPost('/signin', DtoValidationMiddleware(SignInCredentialsDto))
  public async signIn(@requestBody() body: SignInCredentialsDto, req: Request, res: Response) {
    const user = await this.authService.signIn(body);

    res.cookie('token', user.accessToken, {
      httpOnly: true, // JS ile erişilemez
      secure: process.env.NODE_ENV === 'production', // Prod ortamında HTTPS zorunlu
      sameSite: 'lax', // CSRF koruması için
      path: '/', // Tüm endpointlerde erişilebilir
    });

    return res.customSuccess(200, 'Login successfully', instanceToPlain(user));
  }

  @httpPost('/logout')
  public async logout(req: Request, res: Response) {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.customSuccess(200, 'Logged out successfully');
  }

  //   @httpPost('/refresh-token', INTERFACE_TYPE.AuthenticationMiddleware)
  //   public async refreshToken(@requestBody() body: RefreshTokenDto, req: Request, res: Response) {
  //     const value = await this.authService.getAccessToken(body);
  //     return res.status(200).json({
  //       results: value,
  //     });
  //   }
}
