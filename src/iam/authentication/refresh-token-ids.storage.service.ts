import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from 'src/common/redis/redis.service';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;
  constructor(private readonly redisService: RedisService) {}

  onApplicationBootstrap() {
    this.redisClient = this.redisService.getInstance();
  }

  onApplicationShutdown() {
    this.redisClient.quit();
  }

  async insert(userId: number, tokenId: string) {
    const key = this.getKey(userId);
    await this.redisClient.set(key, tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const key = this.getKey(userId);
    const storedTokenId = await this.redisClient.get(key);

    if (storedTokenId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }

    return storedTokenId === tokenId;
  }

  async invalidate(userId: number) {
    const key = this.getKey(userId);
    await this.redisClient.del(key);
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
