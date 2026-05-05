import { CommentLikesRepository } from '@/domain/comment/application/repositories/comment-likes-repository'
import { CommentLike } from '@/domain/comment/enterprise/entities/comment-like'

export class InMemoryCommentLikesRepository implements CommentLikesRepository {
  public items: CommentLike[] = []

  async findByCommentAndUser(commentId: string, userId: string): Promise<CommentLike | null> {
    return (
      this.items.find(
        (item) => item.commentId.toString() === commentId && item.userId.toString() === userId,
      ) ?? null
    )
  }

  async create(commentLike: CommentLike): Promise<void> {
    this.items.push(commentLike)
  }

  async delete(commentLike: CommentLike): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(commentLike.id))
  }
}
