import { Injectable } from '@nestjs/common'
import { VideoLikesRepository } from '@/domain/video/application/repositories/video-likes-repository'
import { VideoLike } from '@/domain/video/enterprise/entities/video-like'
import { PrismaVideoLikeMapper } from '../mappers/prisma-video-like-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaVideoLikesRepository implements VideoLikesRepository {
  constructor(private prisma: PrismaService) {}

  async findByVideoAndUser(videoId: string, userId: string): Promise<VideoLike | null> {
    const like = await this.prisma.videoLike.findFirst({ where: { videoId, userId } })
    if (!like) return null
    return PrismaVideoLikeMapper.toDomain(like)
  }

  async countByVideoId(videoId: string): Promise<number> {
    return this.prisma.videoLike.count({ where: { videoId } })
  }

  async create(videoLike: VideoLike): Promise<void> {
    const data = PrismaVideoLikeMapper.toPrisma(videoLike)
    await this.prisma.videoLike.create({ data })
  }

  async delete(videoLike: VideoLike): Promise<void> {
    await this.prisma.videoLike.delete({ where: { id: videoLike.id.toString() } })
  }
}
