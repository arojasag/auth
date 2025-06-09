import { NextFunction, Request, Response } from 'express';

import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { DataResponse } from '../interfaces/interfaces';
import Redis from 'ioredis';

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

    const encodedToken = match[1];
    // We save the encoded token because the logout endpoint needs it to remove it from the whitelist
    res.locals.encodedToken = encodedToken;

    // We save the decoded token because the GET /auth/me endpoint needs it to easily return the user id
    const decodedToken = jwt.verify( encodedToken, process.env.JWT_SECRET as string);
    res.locals.decodedToken = decodedToken;


    const whitelist = res.locals.whitelist as Redis
    const ans = await whitelist.get(encodedToken)
    if (ans === null) {
      throw new Error("The token that was given is not in the whitelist")
    }

    next();
  } catch (err) {
    console.log('Invalid token:', token);
    console.error(err);
    response.errors.push({ message: `Invalid token: ${token}` });

    return res.status(401).json(response);
  }
};
