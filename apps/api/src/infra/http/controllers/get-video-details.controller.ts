import { BadRequestException, Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { GetVideoDetailsUseCase } from '@/domain/video/application/use-cases/get-video-details'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { VideoPresenter } from '@/infra/http/presenters/video-presenter'

@Controller('/videos')
export class GetVideoDetailsController {
  constructor(private getVideoDetails: GetVideoDetailsUseCase) {}

  @Get(':videoId')
  async handle(@Param('videoId') videoId: string) {
    const result = await this.getVideoDetails.execute({ videoId })

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
      video: VideoPresenter.toHTTP(result.value.video),
    }
  }
}
