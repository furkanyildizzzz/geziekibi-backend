import { Request, Response, NextFunction } from 'express';
import { publicRoutes } from './authMiddleware';
import { asyncLocalStorage, setCurrentUser } from 'orm/subscribers/auditSubscriber';

export const userContextMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (publicRoutes.includes(req.path)) {
    // For public routes, just continue without setting user context
    return next();
  }
  
  if (req.user?.id) {
    await setCurrentUser(req.user, async () => {
      next();
    });
  } else {
    next();
  }
};
