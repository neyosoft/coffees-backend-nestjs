import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import { redisConfig } from 'src/config/redis.config';

@Injectable()
export class RedisService {
  constructor(
    @Inject(redisConfig.KEY)
    private readonly redisConfiguration: ConfigType<typeof redisConfig>,
  ) {}

  private instance: Redis;

  getInstance() {
    if (!this.instance) {
      this.instance = new Redis(this.redisConfiguration);
    }

    return this.instance;
  }
}
