import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Language, Role } from 'orm/entities/users/types';
import { CustomError } from 'shared/errors/CustomError';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: Role;
        language: Language;
        // ... other user properties
      };
    }
  }
}

export const publicRoutes = [
  '/v1/panel/auth/signin',
  '/v1/panel/auth/register',
  '/v1/panel/auth/forgot-password',
  '/v1/website/homepage/featuredTours',
  '/v1/website',
];

// Middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Public route'ları kontrol et (alt yolları da dahil et)
  if (publicRoutes.some((route) => req.path.startsWith(route))) {
    return next();
  }

  let token = req.cookies.token;
  if (!token) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const customError = new CustomError(400, 'BAD REQUEST', 'authorization_header_not_provided');
      return next(customError);
    }

    token = authHeader.split(' ')[1];
  }

  if (!token) {
    const customError = new CustomError(401, 'UNAUTHORIZED', 'authentication_required');
    return next(customError);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      const customError = new CustomError(401, 'UNAUTHORIZED', 'invalid_token');
      return next(customError);
    }
    req.user = { id: decoded.id, role: decoded.role, language: 'tr' };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const customError = new CustomError(401, 'UNAUTHORIZED', 'token_expired');
      return next(customError);
    } else if (error instanceof jwt.JsonWebTokenError) {
      const customError = new CustomError(401, 'UNAUTHORIZED', 'invalid_token');
      return next(customError);
    }
    const customError = new CustomError(500, 'INTERNAL SERVER ERROR', 'internal_server_error');
    return next(customError);
  }
};
