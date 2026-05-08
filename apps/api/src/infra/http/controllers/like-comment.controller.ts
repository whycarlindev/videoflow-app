import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { LikeCommentUseCase } from '@/domain/comment/application/use-cases/like-comment'
import { CommentAlreadyLikedError } from '@/domain/comment/application/use-cases/errors/comment-already-liked-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'

@Controller('/comments/:commentId/like')
export class LikeCommentController {
  constructor(private likeComment: LikeCommentUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('commentId') commentId: string,
  ) {
    const result = await this.likeComment.execute({
      commentId,
      userId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case CommentAlreadyLikedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
