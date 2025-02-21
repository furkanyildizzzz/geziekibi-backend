import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        // ... other user properties
      };
    }
  }
}

export const publicRoutes = [
  '/v1/panel/auth/signin',
  '/v1/panel/auth/register',
  '/v1/panel/auth/forgot-password',
  // Add any other public routes
];

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip authentication for public routes
  console.log(req.path);
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { id: number };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
