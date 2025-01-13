import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
  port: parseInt(process.env.REDIS_PORT, 10) || 6380,
  host: process.env.REDIS_HOST || 'localhost',
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD || 'password',
  db: parseInt(process.env.REDIS_DB, 10) || 0,
}));
