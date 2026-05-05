import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CommentLikeProps {
  commentId: UniqueEntityId
  userId: UniqueEntityId
  createdAt: Date
}

export class CommentLike extends Entity<CommentLikeProps> {
  get commentId(): UniqueEntityId {
    return this.props.commentId
  }
  get userId(): UniqueEntityId {
    return this.props.userId
  }
  get createdAt(): Date {
    return this.props.createdAt
  }

  private constructor(props: CommentLikeProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(props: Omit<CommentLikeProps, 'createdAt'>, id?: UniqueEntityId): CommentLike {
    return new CommentLike({ ...props, createdAt: new Date() }, id)
  }
}
