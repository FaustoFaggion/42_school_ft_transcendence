import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Bearer Token

      try {
        const payload = await this.jwtService.verifyAsync(token);
        // req.user = payload;
      } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
      }
    } else {
      return res.status(401).json({ message: 'Token não fornecido' });
    }
    next();
  }
}