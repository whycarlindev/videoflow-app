import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface VideoLikeProps {
  videoId: UniqueEntityId
  userId: UniqueEntityId
  createdAt: Date
}

export class VideoLike extends Entity<VideoLikeProps> {
  get videoId(): UniqueEntityId {
    return this.props.videoId
  }
  get userId(): UniqueEntityId {
    return this.props.userId
  }
  get createdAt(): Date {
    return this.props.createdAt
  }

  private constructor(props: VideoLikeProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(props: Omit<VideoLikeProps, 'createdAt'>, id?: UniqueEntityId): VideoLike {
    return new VideoLike({ ...props, createdAt: new Date() }, id)
  }
}
