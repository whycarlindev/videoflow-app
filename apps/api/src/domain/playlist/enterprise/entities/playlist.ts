import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { PlaylistCreatedEvent } from '../events/playlist-created-event'
import { VideoAddedToPlaylistEvent } from '../events/video-added-to-playlist-event'
import { VideoRemovedFromPlaylistEvent } from '../events/video-removed-from-playlist-event'
import { PlaylistItem } from './playlist-item'
import { PlaylistVideosList } from './playlist-videos-list'

export interface PlaylistProps {
  title: string
  description: string | null
  authorId: UniqueEntityId
  isPublic: boolean
  videos: PlaylistVideosList
  createdAt: Date
  updatedAt?: Date | null
}

export class Playlist extends AggregateRoot<PlaylistProps> {
  get title(): string {
    return this.props.title
  }
  get description(): string | null {
    return this.props.description
  }
  get authorId(): UniqueEntityId {
    return this.props.authorId
  }
  get isPublic(): boolean {
    return this.props.isPublic
  }
  get videos(): PlaylistVideosList {
    return this.props.videos
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

  set title(value: string) {
    this.props.title = value
    this.touch()
  }

  set description(value: string | null) {
    this.props.description = value
    this.touch()
  }

  makePublic(): void {
    this.props.isPublic = true
    this.touch()
  }

  makePrivate(): void {
    this.props.isPublic = false
    this.touch()
  }

  addVideo(videoId: UniqueEntityId): void {
    const position = this.props.videos.getItems().length + 1
    const item = PlaylistItem.create({ playlistId: this.id, videoId, position })
    this.props.videos.add(item)
    this.touch()
    this.addDomainEvent(new VideoAddedToPlaylistEvent(this, videoId))
  }

  removeVideo(videoId: UniqueEntityId): void {
    const item = this.props.videos.getItems().find((i) => i.videoId.equals(videoId))
    if (item) {
      this.props.videos.remove(item)
      this.touch()
      this.addDomainEvent(new VideoRemovedFromPlaylistEvent(this, videoId))
    }
  }

  hasVideo(videoId: UniqueEntityId): boolean {
    return this.props.videos.getItems().some((i) => i.videoId.equals(videoId))
  }

  private constructor(props: PlaylistProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(
    props: Optional<PlaylistProps, 'description' | 'isPublic' | 'videos' | 'createdAt'>,
    id?: UniqueEntityId,
  ): Playlist {
    const playlist = new Playlist(
      {
        ...props,
        description: props.description ?? null,
        isPublic: props.isPublic ?? true,
        videos: props.videos ?? new PlaylistVideosList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNew = !id
    if (isNew) {
      playlist.addDomainEvent(new PlaylistCreatedEvent(playlist))
    }

    return playlist
  }
}
