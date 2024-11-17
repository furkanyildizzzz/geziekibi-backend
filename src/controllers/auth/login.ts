import { Request, Response, NextFunction } from 'express';
import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { getRepository } from 'typeorm';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'shared/utils/createJwtToken';
import { CustomError } from 'shared/errors/CustomError';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const userRepo = getRepository(User);
  try {
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      const customError = new CustomError(400, 'General', 'Incorrect email or password');
      return next(customError);
    }

    if (!user.checkIfPasswordMatch(password)) {
      const customError = new CustomError(400, 'General', 'Incorrect email or password');
      return next(customError);
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
      res.customSuccess(200, `Token created successfully.`, `${token}`);
    } catch (err) {
      const customError = new CustomError(400, 'Raw', "Token can't be created", null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
