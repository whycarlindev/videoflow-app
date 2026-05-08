import { VideoLike as PrismaVideoLike } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { VideoLike } from '@/domain/video/enterprise/entities/video-like'

export class PrismaVideoLikeMapper {
  static toDomain(raw: PrismaVideoLike): VideoLike {
    return VideoLike.create(
      {
        videoId: new UniqueEntityId(raw.videoId),
        userId: new UniqueEntityId(raw.userId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(videoLike: VideoLike) {
    return {
      id: videoLike.id.toString(),
      videoId: videoLike.videoId.toString(),
      userId: videoLike.userId.toString(),
      createdAt: videoLike.createdAt,
    }
  }
}
