import { Injectable } from '@nestjs/common'

import { VideoProps } from '@/domain/video/enterprise/entities/video'
import { PrismaVideoMapper } from '@/infra/database/prisma/mappers/prisma-video-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { makeVideo } from './make-video'

@Injectable()
export class VideoFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaVideo(override: Partial<VideoProps> = {}) {
    const video = makeVideo(override)

    await this.prisma.video.create({
      data: PrismaVideoMapper.toPrisma(video),
    })

    return video
  }
}
