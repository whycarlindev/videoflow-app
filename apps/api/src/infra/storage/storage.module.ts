import { Module } from '@nestjs/common'
import { VideoUploader } from '@/domain/video/application/ports/video-uploader'
import { EnvModule } from '../env/env.module'
import { R2Storage } from './r2-storage'

@Module({
  imports: [EnvModule],
  providers: [{ provide: VideoUploader, useClass: R2Storage }],
  exports: [VideoUploader],
})
export class StorageModule {}
