import { Video } from '@/domain/video/enterprise/entities/video'

export class VideoPresenter {
  static toHTTP(video: Video) {
    return {
      id: video.id.toString(),
      title: video.title,
      description: video.description,
      url: video.url,
      thumbnailUrl: video.thumbnailUrl,
      durationSeconds: video.duration?.seconds ?? null,
      slug: video.slug.value,
      authorId: video.authorId.toString(),
      status: video.status.value,
      tags: video.tags.getItems(),
      likesCount: video.likesCount,
      viewsCount: video.viewsCount,
      createdAt: video.createdAt,
    }
  }
}
