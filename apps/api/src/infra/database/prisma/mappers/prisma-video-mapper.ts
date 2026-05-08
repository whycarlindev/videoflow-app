import { Prisma, Video as PrismaVideo, VideoTag as PrismaVideoTag } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Video } from '@/domain/video/enterprise/entities/video'
import { VideoTagsList } from '@/domain/video/enterprise/entities/video-tags-list'
import { Duration } from '@/domain/video/enterprise/entities/value-objects/duration'
import { Slug } from '@/domain/video/enterprise/entities/value-objects/slug'
import { VideoStatus, VideoStatusEnum } from '@/domain/video/enterprise/entities/value-objects/video-status'

type PrismaVideoWithTags = PrismaVideo & { tags: PrismaVideoTag[] }

export class PrismaVideoMapper {
  static toDomain(raw: PrismaVideoWithTags): Video {
    const tags = raw.tags.map((t) => t.tag)

    let duration: Duration | null = null
    if (raw.duration !== null && raw.duration !== undefined) {
      const durationResult = Duration.create(raw.duration)
      if (durationResult.isRight()) {
        duration = durationResult.value
      }
    }

    return Video.create(
      {
        title: raw.title,
        description: raw.description,
        url: raw.url,
        thumbnailUrl: raw.thumbnailUrl,
        duration,
        slug: Slug.create(raw.slug),
        authorId: new UniqueEntityId(raw.authorId),
        status: VideoStatus.create(raw.status as VideoStatusEnum),
        tags: new VideoTagsList(tags),
        likesCount: raw.likesCount,
        viewsCount: raw.viewsCount,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(video: Video): Prisma.VideoUncheckedCreateInput {
    return {
      id: video.id.toString(),
      title: video.title,
      description: video.description,
      url: video.url,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration?.seconds ?? null,
      slug: video.slug.value,
      authorId: video.authorId.toString(),
      status: video.status.value,
      likesCount: video.likesCount,
      viewsCount: video.viewsCount,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    }
  }
}
