import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: +process.env.JWT_TOKEN_TTL,
  refreshTokenExpiresIn: +process.env.JWT_REFRESH_TOKEN_TTL,
  issuer: process.env.JWT_TOKEN_ISSUER,
  audience: process.env.JWT_TOKEN_AUDIENCE,
}));
