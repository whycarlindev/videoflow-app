import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface PlaylistItemProps {
  playlistId: UniqueEntityId
  videoId: UniqueEntityId
  position: number
  addedAt: Date
}

export class PlaylistItem extends Entity<PlaylistItemProps> {
  get playlistId(): UniqueEntityId {
    return this.props.playlistId
  }
  get videoId(): UniqueEntityId {
    return this.props.videoId
  }
  get position(): number {
    return this.props.position
  }
  get addedAt(): Date {
    return this.props.addedAt
  }

  private constructor(props: PlaylistItemProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(props: Omit<PlaylistItemProps, 'addedAt'>, id?: UniqueEntityId): PlaylistItem {
    return new PlaylistItem({ ...props, addedAt: new Date() }, id)
  }
}
