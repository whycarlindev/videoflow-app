import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Video, VideoProps } from '@/domain/video/enterprise/entities/video'

export function makeVideo(override: Partial<VideoProps> = {}, id?: UniqueEntityId): Video {
  return Video.create(
    {
      title: 'Sample Video Title',
      description: 'A test video description.',
      authorId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}
