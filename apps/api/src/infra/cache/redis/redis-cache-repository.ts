import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { EnvService } from '@/infra/env/env.service'
import { CacheRepository } from '../cache-repository'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  private client: Redis

  constructor(envService: EnvService) {
    this.client = new Redis({
      host: envService.get('REDIS_HOST'),
      port: envService.get('REDIS_PORT'),
      password: envService.get('REDIS_PASSWORD'),
    })
  }

  async set(key: string, value: string, ttlSeconds = 600): Promise<void> {
    await this.client.set(key, value, 'EX', ttlSeconds)
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key)
  }
}
