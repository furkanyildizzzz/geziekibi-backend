import { Request, Response, NextFunction } from 'express';
import { CustomError } from 'shared/errors/CustomError';

import jwt from 'jsonwebtoken';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'shared/utils/createJwtToken';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies.token;
  if (!token) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      const customError = new CustomError(400, 'BAD REQUEST', 'Authorization header not provided');
      return next(customError);
    }

    token = authHeader.split(' ')[1];
  }
  let jwtPayload: { [key: string]: any };
  try {
    jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as { [key: string]: any };
    ['iat', 'exp'].forEach((keyToRemove) => delete jwtPayload[keyToRemove]);
    req.jwtPayload = jwtPayload as JwtPayload;
  } catch (err) {
    const customError = new CustomError(401, 'Raw', 'JWT error', null, err);
    return next(customError);
  }

  try {
    const newToken = createJwtToken(jwtPayload as JwtPayload);
    res.setHeader('token', `${newToken}`);
    return next();
  } catch (err) {
    const customError = new CustomError(400, 'Raw', "Token can't be created", null, err);
    return next(customError);
  }
};
