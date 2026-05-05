import { VideoLike } from '../../enterprise/entities/video-like'

export abstract class VideoLikesRepository {
  abstract findByVideoAndUser(videoId: string, userId: string): Promise<VideoLike | null>
  abstract countByVideoId(videoId: string): Promise<number>
  abstract create(videoLike: VideoLike): Promise<void>
  abstract delete(videoLike: VideoLike): Promise<void>
}
