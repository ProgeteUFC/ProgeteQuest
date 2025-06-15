import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Token não informado');

    const token = authHeader.split('Bearer ')[1];
    if (!token) throw new UnauthorizedException('Token inválido');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      // @ts-ignore
      req.user = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
