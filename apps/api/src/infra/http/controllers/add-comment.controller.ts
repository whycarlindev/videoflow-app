import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AddCommentUseCase } from '@/domain/comment/application/use-cases/add-comment'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CommentPresenter } from '@/infra/http/presenters/comment-presenter'

const addCommentBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(addCommentBodySchema)
type AddCommentBodySchema = z.infer<typeof addCommentBodySchema>

@Controller('/videos/:videoId/comments')
export class AddCommentController {
  constructor(private addComment: AddCommentUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('videoId') videoId: string,
    @Body(bodyValidationPipe) body: AddCommentBodySchema,
  ) {
    const result = await this.addComment.execute({
      videoId,
      authorId: user.sub,
      content: body.content,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      comment: CommentPresenter.toHTTP(result.value.comment),
    }
  }
}
