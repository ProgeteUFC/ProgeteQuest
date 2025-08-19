import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function RoleMiddleware(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = req.user;
    if (!user || !roles.includes(user.type)) {
      throw new ForbiddenException('Acesso negado');
    }
    next();
  };
}
