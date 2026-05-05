import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { VideoCreatedEvent } from '../events/video-created-event'
import { VideoLikedEvent } from '../events/video-liked-event'
import { VideoPublishedEvent } from '../events/video-published-event'
import { Duration } from './value-objects/duration'
import { Slug } from './value-objects/slug'
import { VideoStatus } from './value-objects/video-status'
import { VideoTagsList } from './video-tags-list'

export interface VideoProps {
  title: string
  description: string
  url: string | null
  thumbnailUrl: string | null
  duration: Duration | null
  slug: Slug
  authorId: UniqueEntityId
  status: VideoStatus
  tags: VideoTagsList
  likesCount: number
  viewsCount: number
  createdAt: Date
  updatedAt?: Date | null
}

export class Video extends AggregateRoot<VideoProps> {
  get title(): string {
    return this.props.title
  }
  get description(): string {
    return this.props.description
  }
  get url(): string | null {
    return this.props.url
  }
  get thumbnailUrl(): string | null {
    return this.props.thumbnailUrl
  }
  get duration(): Duration | null {
    return this.props.duration
  }
  get slug(): Slug {
    return this.props.slug
  }
  get authorId(): UniqueEntityId {
    return this.props.authorId
  }
  get status(): VideoStatus {
    return this.props.status
  }
  get tags(): VideoTagsList {
    return this.props.tags
  }
  get likesCount(): number {
    return this.props.likesCount
  }
  get viewsCount(): number {
    return this.props.viewsCount
  }
  get createdAt(): Date {
    return this.props.createdAt
  }
  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  set title(value: string) {
    this.props.title = value
    this.props.slug = Slug.createFromText(value)
    this.touch()
  }

  set description(value: string) {
    this.props.description = value
    this.touch()
  }

  set thumbnailUrl(value: string | null) {
    this.props.thumbnailUrl = value
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  isAvailableForViewing(): boolean {
    return this.props.status.isPublished()
  }

  markAsProcessing(): void {
    if (!this.props.status.isPending()) {
      throw new Error('Video must be pending to mark as processing')
    }
    this.props.status = VideoStatus.processing()
    this.touch()
  }

  publish(): void {
    if (!this.props.status.isProcessing() && !this.props.status.isPending()) {
      throw new Error('Only pending or processing videos can be published')
    }
    this.props.status = VideoStatus.published()
    this.touch()
    this.addDomainEvent(new VideoPublishedEvent(this))
  }

  delete(): void {
    this.props.status = VideoStatus.deleted()
    this.touch()
  }

  incrementViews(): void {
    this.props.viewsCount += 1
  }

  addLike(userId: UniqueEntityId): void {
    this.props.likesCount += 1
    this.addDomainEvent(new VideoLikedEvent(this, userId))
  }

  removeLike(): void {
    if (this.props.likesCount > 0) {
      this.props.likesCount -= 1
    }
  }

  updateTags(tags: string[]): void {
    this.props.tags.update(tags)
    this.touch()
  }

  private constructor(props: VideoProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(
    props: Optional<
      VideoProps,
      | 'status'
      | 'tags'
      | 'likesCount'
      | 'viewsCount'
      | 'createdAt'
      | 'slug'
      | 'url'
      | 'thumbnailUrl'
      | 'duration'
    >,
    id?: UniqueEntityId,
  ): Video {
    const video = new Video(
      {
        ...props,
        url: props.url ?? null,
        thumbnailUrl: props.thumbnailUrl ?? null,
        duration: props.duration ?? null,
        slug: props.slug ?? Slug.createFromText(props.title),
        status: props.status ?? VideoStatus.pending(),
        tags: props.tags ?? new VideoTagsList(),
        likesCount: props.likesCount ?? 0,
        viewsCount: props.viewsCount ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNew = !id

    if (isNew) {
      video.addDomainEvent(new VideoCreatedEvent(video))
    }

    return video
  }
}
