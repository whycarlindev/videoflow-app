import { PaginationParams } from '@/core/repositories/pagination-params'
import { Playlist } from '../../enterprise/entities/playlist'

export abstract class PlaylistsRepository {
  abstract findById(id: string): Promise<Playlist | null>
  abstract findManyByAuthorId(authorId: string, params: PaginationParams): Promise<Playlist[]>
  abstract create(playlist: Playlist): Promise<void>
  abstract save(playlist: Playlist): Promise<void>
  abstract delete(playlist: Playlist): Promise<void>
}
