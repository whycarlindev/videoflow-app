import { VideoLikesRepository } from '@/domain/video/application/repositories/video-likes-repository'
import { VideoLike } from '@/domain/video/enterprise/entities/video-like'

export class InMemoryVideoLikesRepository implements VideoLikesRepository {
  public items: VideoLike[] = []

  async findByVideoAndUser(videoId: string, userId: string): Promise<VideoLike | null> {
    return (
      this.items.find(
        (item) => item.videoId.toString() === videoId && item.userId.toString() === userId,
      ) ?? null
    )
  }

  async countByVideoId(videoId: string): Promise<number> {
    return this.items.filter((item) => item.videoId.toString() === videoId).length
  }

  async create(videoLike: VideoLike): Promise<void> {
    this.items.push(videoLike)
  }

  async delete(videoLike: VideoLike): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(videoLike.id))
  }
}
