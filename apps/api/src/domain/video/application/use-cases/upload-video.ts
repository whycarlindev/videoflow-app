import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Video } from '../../enterprise/entities/video'
import { VideosRepository } from '../repositories/videos-repository'

type UploadVideoUseCaseRequest = {
  title: string
  description: string
  authorId: string
  tags?: string[]
}

type UploadVideoUseCaseResponse = Either<never, { video: Video }>

@Injectable()
export class UploadVideoUseCase {
  constructor(private videosRepository: VideosRepository) {}

  async execute({
    title,
    description,
    authorId,
    tags = [],
  }: UploadVideoUseCaseRequest): Promise<UploadVideoUseCaseResponse> {
    const video = Video.create({
      title,
      description,
      authorId: new UniqueEntityId(authorId),
    })

    video.updateTags(tags)

    await this.videosRepository.create(video)

    return right({ video })
  }
}
