import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'
import { UploadVideoUseCase } from '@/domain/video/application/use-cases/upload-video'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { VideoPresenter } from '@/infra/http/presenters/video-presenter'

const uploadVideoBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  fileBase64: z.string(),
  tags: z.array(z.string()).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(uploadVideoBodySchema)
type UploadVideoBodySchema = z.infer<typeof uploadVideoBodySchema>

@Controller('/videos')
export class UploadVideoController {
  constructor(private uploadVideo: UploadVideoUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: UploadVideoBodySchema,
  ) {
    const { title, description, fileName, fileType, fileBase64, tags } = body

    const fileBody = Buffer.from(fileBase64, 'base64')

    const result = await this.uploadVideo.execute({
      title,
      description,
      authorId: user.sub,
      fileName,
      fileType,
      fileBody,
      tags,
    })

    if (result.isLeft()) {
      throw new BadRequestException('An unexpected error occurred')
    }

    return {
      video: VideoPresenter.toHTTP(result.value.video),
    }
  }
}
