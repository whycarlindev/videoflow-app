import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ListVideosUseCase } from '@/domain/video/application/use-cases/list-videos'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { VideoPresenter } from '@/infra/http/presenters/video-presenter'

const listVideosQuerySchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().optional(),
})

const queryValidationPipe = new ZodValidationPipe(listVideosQuerySchema)
type ListVideosQuerySchema = z.infer<typeof listVideosQuerySchema>

@Controller('/videos')
export class ListVideosController {
  constructor(private listVideos: ListVideosUseCase) {}

  @Get()
  async handle(@Query(queryValidationPipe) query: ListVideosQuerySchema) {
    const { page, perPage } = query

    const result = await this.listVideos.execute({ page, perPage })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      videos: result.value.videos.map(VideoPresenter.toHTTP),
    }
  }
}
