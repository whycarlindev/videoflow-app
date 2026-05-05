import { PaginationParams } from '@/core/repositories/pagination-params'
import { Comment } from '../../enterprise/entities/comment'

export abstract class CommentsRepository {
  abstract findById(id: string): Promise<Comment | null>
  abstract findManyByVideoId(videoId: string, params: PaginationParams): Promise<Comment[]>
  abstract create(comment: Comment): Promise<void>
  abstract save(comment: Comment): Promise<void>
  abstract delete(comment: Comment): Promise<void>
}
