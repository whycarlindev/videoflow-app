import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { DeleteVideoUseCase } from '@/domain/video/application/use-cases/delete-video'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'

@Controller('/videos')
export class DeleteVideoController {
  constructor(private deleteVideo: DeleteVideoUseCase) {}

  @Delete(':videoId')
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('videoId') videoId: string,
  ) {
    const result = await this.deleteVideo.execute({
      videoId,
      authorId: user.sub,
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
  }
}
