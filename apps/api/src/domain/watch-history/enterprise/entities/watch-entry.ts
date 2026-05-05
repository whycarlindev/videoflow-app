import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface WatchEntryProps {
  userId: UniqueEntityId
  videoId: UniqueEntityId
  progressPercentage: number
  completed: boolean
  watchedAt: Date
}

export class WatchEntry extends Entity<WatchEntryProps> {
  get userId(): UniqueEntityId {
    return this.props.userId
  }
  get videoId(): UniqueEntityId {
    return this.props.videoId
  }
  get progressPercentage(): number {
    return this.props.progressPercentage
  }
  get completed(): boolean {
    return this.props.completed
  }
  get watchedAt(): Date {
    return this.props.watchedAt
  }

  updateProgress(percentage: number): void {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Progress percentage must be between 0 and 100')
    }
    this.props.progressPercentage = percentage
    this.props.completed = percentage >= 95
    this.props.watchedAt = new Date()
  }

  private constructor(props: WatchEntryProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(
    props: Omit<WatchEntryProps, 'completed' | 'watchedAt'> & {
      completed?: boolean
      watchedAt?: Date
    },
    id?: UniqueEntityId,
  ): WatchEntry {
    return new WatchEntry(
      {
        ...props,
        completed: props.completed ?? props.progressPercentage >= 95,
        watchedAt: props.watchedAt ?? new Date(),
      },
      id,
    )
  }
}
