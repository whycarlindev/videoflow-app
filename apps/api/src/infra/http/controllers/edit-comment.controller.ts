import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditCommentUseCase } from '@/domain/comment/application/use-cases/edit-comment'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CommentPresenter } from '@/infra/http/presenters/comment-presenter'

const editCommentBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editCommentBodySchema)
type EditCommentBodySchema = z.infer<typeof editCommentBodySchema>

@Controller('/comments/:commentId')
export class EditCommentController {
  constructor(private editComment: EditCommentUseCase) {}

  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('commentId') commentId: string,
    @Body(bodyValidationPipe) body: EditCommentBodySchema,
  ) {
    const result = await this.editComment.execute({
      commentId,
      authorId: user.sub,
      content: body.content,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      comment: CommentPresenter.toHTTP(result.value.comment),
    }
  }
}
