import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { UnlikeVideoUseCase } from '@/domain/video/application/use-cases/unlike-video'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'

@Controller('/videos')
export class UnlikeVideoController {
  constructor(private unlikeVideo: UnlikeVideoUseCase) {}

  @Delete(':videoId/like')
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('videoId') videoId: string,
  ) {
    const result = await this.unlikeVideo.execute({
      videoId,
      userId: user.sub,
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
  }
}
