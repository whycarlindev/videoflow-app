import { CommentLike } from '../../enterprise/entities/comment-like'

export abstract class CommentLikesRepository {
  abstract findByCommentAndUser(commentId: string, userId: string): Promise<CommentLike | null>
  abstract create(commentLike: CommentLike): Promise<void>
  abstract delete(commentLike: CommentLike): Promise<void>
}
