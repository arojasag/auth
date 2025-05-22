import { NextFunction, Request, Response } from 'express';

import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { DataResponse } from '../interfaces/interfaces';

export const verifyToken = async (req: Request, res: Response<DataResponse>, next: NextFunction) => {
  const regex = /^Bearer (.+)$/;
  const token = req.headers.authorization;

  const response: DataResponse = {
    data: null,
    errors: [],
  };

  if (!token || typeof token !== 'string') {
    response.errors.push({ message: 'No token provided' });
    return res.status(401).json(response);
  }
  try {

    const match = regex.exec(token);

    if (match === null) {
      throw new JsonWebTokenError('Invalid Bearer token');
    }

    const bearer = match[1];
    //The logout endpoint needs the encoded token to remove it from the whitelist
    res.locals.bearerToken = bearer;

    // TODO: verify token is whitelisted. If not throw an exception

    //The GET /auth/me endpoint needs the decoded token to easily return the user id
    const decoded = jwt.verify( bearer, process.env.JWT_SECRET as string);
    res.locals.decoded = decoded;

    next();
  } catch (err) {
    console.log('Invalid token:', token);
    console.error(err);
    response.errors.push({ message: `Invalid token: ${token}` });

    return res.status(401).json(response);
  }
};
