import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PlaylistsRepository } from '@/domain/playlist/application/repositories/playlists-repository'
import { Playlist } from '@/domain/playlist/enterprise/entities/playlist'

export class InMemoryPlaylistsRepository implements PlaylistsRepository {
  public items: Playlist[] = []

  async findById(id: string): Promise<Playlist | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findManyByAuthorId(
    authorId: string,
    { page, perPage = 20 }: PaginationParams,
  ): Promise<Playlist[]> {
    return this.items
      .filter((item) => item.authorId.toString() === authorId)
      .slice((page - 1) * perPage, page * perPage)
  }

  async create(playlist: Playlist): Promise<void> {
    this.items.push(playlist)
    DomainEvents.dispatchEventsForAggregate(playlist.id)
  }

  async save(playlist: Playlist): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(playlist.id))
    if (index >= 0) {
      this.items[index] = playlist
    }
    DomainEvents.dispatchEventsForAggregate(playlist.id)
  }

  async delete(playlist: Playlist): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(playlist.id))
  }
}
