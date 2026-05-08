import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { CacheModule } from './cache/cache.module'
import { DatabaseModule } from './database/database.module'
import { EnvModule } from './env/env.module'
import { EventsModule } from './events/events.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [EnvModule, AuthModule, DatabaseModule, CacheModule, HttpModule, EventsModule],
})
export class AppModule {}
