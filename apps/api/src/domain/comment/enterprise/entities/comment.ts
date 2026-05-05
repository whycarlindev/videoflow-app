import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { CommentCreatedEvent } from '../events/comment-created-event'
import { CommentLikedEvent } from '../events/comment-liked-event'

export interface CommentProps {
  videoId: UniqueEntityId
  authorId: UniqueEntityId
  content: string
  likesCount: number
  createdAt: Date
  updatedAt?: Date | null
}

export class Comment extends AggregateRoot<CommentProps> {
  get videoId(): UniqueEntityId {
    return this.props.videoId
  }
  get authorId(): UniqueEntityId {
    return this.props.authorId
  }
  get content(): string {
    return this.props.content
  }
  get likesCount(): number {
    return this.props.likesCount
  }
  get createdAt(): Date {
    return this.props.createdAt
  }
  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }

  edit(newContent: string): void {
    this.props.content = newContent
    this.touch()
  }

  addLike(userId: UniqueEntityId): void {
    this.props.likesCount += 1
    this.addDomainEvent(new CommentLikedEvent(this, userId))
  }

  removeLike(): void {
    if (this.props.likesCount > 0) {
      this.props.likesCount -= 1
    }
  }

  private constructor(props: CommentProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(
    props: Optional<CommentProps, 'likesCount' | 'createdAt'>,
    id?: UniqueEntityId,
  ): Comment {
    const comment = new Comment(
      {
        ...props,
        likesCount: props.likesCount ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNew = !id
    if (isNew) {
      comment.addDomainEvent(new CommentCreatedEvent(comment))
    }

    return comment
  }
}
