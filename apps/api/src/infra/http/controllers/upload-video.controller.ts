import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { z } from 'zod'
import { UploadVideoUseCase } from '@/domain/video/application/use-cases/upload-video'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { VideoPresenter } from '@/infra/http/presenters/video-presenter'

const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024 // 500 MB

const uploadVideoBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return []
      try {
        return JSON.parse(val) as string[]
      } catch {
        return val.split(',').map((t) => t.trim()).filter(Boolean)
      }
    }),
})

const bodyValidationPipe = new ZodValidationPipe(uploadVideoBodySchema)
type UploadVideoBodySchema = z.infer<typeof uploadVideoBodySchema>

@Controller('/videos')
export class UploadVideoController {
  constructor(private uploadVideo: UploadVideoUseCase) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: UploadVideoBodySchema,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        `File type "${file.mimetype}" is not supported. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      )
    }

    const { title, description, tags } = body

    const result = await this.uploadVideo.execute({
      title,
      description,
      authorId: user.sub,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileBody: file.buffer,
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
