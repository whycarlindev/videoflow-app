import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { LikeVideoUseCase } from '@/domain/video/application/use-cases/like-video'
import { VideoAlreadyLikedError } from '@/domain/video/application/use-cases/errors/video-already-liked-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'

@Controller('/videos')
export class LikeVideoController {
  constructor(private likeVideo: LikeVideoUseCase) {}

  @Post(':videoId/like')
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('videoId') videoId: string,
  ) {
    const result = await this.likeVideo.execute({
      videoId,
      userId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case VideoAlreadyLikedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
