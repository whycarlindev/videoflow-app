import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { PublishVideoUseCase } from '@/domain/video/application/use-cases/publish-video'
import { VideoAlreadyPublishedError } from '@/domain/video/application/use-cases/errors/video-already-published-error'
import { InvalidVideoStateError } from '@/domain/video/enterprise/errors/invalid-video-state-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { VideoPresenter } from '@/infra/http/presenters/video-presenter'

@Controller('/videos')
export class PublishVideoController {
  constructor(private publishVideo: PublishVideoUseCase) {}

  @Patch(':videoId/publish')
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('videoId') videoId: string,
  ) {
    const result = await this.publishVideo.execute({
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
        case VideoAlreadyPublishedError:
        case InvalidVideoStateError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      video: VideoPresenter.toHTTP(result.value.video),
    }
  }
}
