import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { VideoLike, VideoLikeProps } from '@/domain/video/enterprise/entities/video-like'

export function makeVideoLike(
  override: Partial<VideoLikeProps> = {},
  id?: UniqueEntityId,
): VideoLike {
  return VideoLike.create(
    {
      videoId: new UniqueEntityId(),
      userId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}
