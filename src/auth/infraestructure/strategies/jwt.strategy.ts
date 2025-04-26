import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UseFilters } from '@nestjs/common';
import { JwtExceptionFilter } from '../filters/jwt-exception.filter';

@Injectable()
@UseFilters(JwtExceptionFilter)
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: string) {
    return { tokenUser: payload };
  }
}
