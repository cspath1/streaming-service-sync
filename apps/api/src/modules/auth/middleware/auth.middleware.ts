import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/nestjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const authToken = req.headers.authorization;
    //remove the decodedToken property if it is trying to be passed in the request
    delete req.body?.decodedToken;
    req.body = { ...req.body, decodedToken: { userId: null, bot: false } };

    if (authToken) {
      const auth = authToken.split(' ');
      if (auth[0] == 'Bearer') {
        try {
          const decodedToken = await this.jwtService.verifyAsync(auth[1], {
            secret: process.env.JWT_SECRET,
          });
          if (decodedToken) {
            req.body.decodedToken = {
              bot: decodedToken === process.env.BOT_SECRET,
              userId: decodedToken?.userId ?? null,
            };
            if (decodedToken?.userId) {
              Sentry.setUser({ id: decodedToken.uid });
            } else if (decodedToken === process.env.BOT_SECRET) {
              Sentry.setUser({ id: 'BP_BOT' });
            }
          }
        } catch {
          next();
        }
      }
    }
    next();
  }
}
