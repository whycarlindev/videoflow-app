import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { UserCreatedEvent } from '../events/user-created-event'
import { Email } from './value-objects/email'
import { Username } from './value-objects/username'

export interface UserProps {
  email: Email
  username: Username
  passwordHash: string
  avatarUrl: string | null
  bio: string | null
  subscribersCount: number
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends AggregateRoot<UserProps> {
  get email(): Email {
    return this.props.email
  }

  get username(): Username {
    return this.props.username
  }

  get passwordHash(): string {
    return this.props.passwordHash
  }

  get avatarUrl(): string | null {
    return this.props.avatarUrl
  }

  get bio(): string | null {
    return this.props.bio
  }

  get subscribersCount(): number {
    return this.props.subscribersCount
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

  updateProfile(bio: string | null): void {
    this.props.bio = bio
    this.touch()
  }

  changeAvatar(avatarUrl: string | null): void {
    this.props.avatarUrl = avatarUrl
    this.touch()
  }

  incrementSubscribers(): void {
    this.props.subscribersCount += 1
  }

  decrementSubscribers(): void {
    if (this.props.subscribersCount > 0) {
      this.props.subscribersCount -= 1
    }
  }

  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(
    props: Optional<UserProps, 'avatarUrl' | 'bio' | 'subscribersCount' | 'createdAt'>,
    id?: UniqueEntityId,
  ): User {
    const user = new User(
      {
        ...props,
        avatarUrl: props.avatarUrl ?? null,
        bio: props.bio ?? null,
        subscribersCount: props.subscribersCount ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNew = !id
    if (isNew) {
      user.addDomainEvent(new UserCreatedEvent(user))
    }

    return user
  }
}
