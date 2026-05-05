import { PaginationParams } from '@/core/repositories/pagination-params'
import { Video } from '../../enterprise/entities/video'

export abstract class VideosRepository {
  abstract findById(id: string): Promise<Video | null>
  abstract findBySlug(slug: string): Promise<Video | null>
  abstract findManyByAuthorId(authorId: string, params: PaginationParams): Promise<Video[]>
  abstract findMany(params: PaginationParams): Promise<Video[]>
  abstract create(video: Video): Promise<void>
  abstract save(video: Video): Promise<void>
  abstract delete(video: Video): Promise<void>
}
