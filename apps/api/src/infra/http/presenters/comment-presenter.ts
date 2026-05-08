import { Comment } from '@/domain/comment/enterprise/entities/comment'

export class CommentPresenter {
  static toHTTP(comment: Comment) {
    return {
      id: comment.id.toString(),
      videoId: comment.videoId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      likesCount: comment.likesCount,
      createdAt: comment.createdAt,
    }
  }
}
