import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Video } from '../../enterprise/entities/video'
import { VideoUploader } from '../ports/video-uploader'
import { VideosRepository } from '../repositories/videos-repository'

type UploadVideoUseCaseRequest = {
  title: string
  description: string
  authorId: string
  fileName: string
  fileType: string
  fileBody: Buffer
  tags?: string[]
}

type UploadVideoUseCaseResponse = Either<never, { video: Video }>

@Injectable()
export class UploadVideoUseCase {
  constructor(
    private videosRepository: VideosRepository,
    private videoUploader: VideoUploader,
  ) {}

  async execute({
    title,
    description,
    authorId,
    fileName,
    fileType,
    fileBody,
    tags = [],
  }: UploadVideoUseCaseRequest): Promise<UploadVideoUseCaseResponse> {
    const { url } = await this.videoUploader.upload({
      fileName,
      fileType,
      body: fileBody,
    })

    const video = Video.create({
      title,
      description,
      authorId: new UniqueEntityId(authorId),
      url,
    })

    video.updateTags(tags)

    await this.videosRepository.create(video)

    return right({ video })
  }
}
