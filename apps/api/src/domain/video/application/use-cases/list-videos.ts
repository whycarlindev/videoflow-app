import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { Video } from '../../enterprise/entities/video'
import { VideosRepository } from '../repositories/videos-repository'

type ListVideosUseCaseRequest = {
  page: number
  perPage?: number
}

type ListVideosUseCaseResponse = Either<never, { videos: Video[] }>

@Injectable()
export class ListVideosUseCase {
  constructor(private videosRepository: VideosRepository) {}

  async execute({
    page,
    perPage = 20,
  }: ListVideosUseCaseRequest): Promise<ListVideosUseCaseResponse> {
    const videos = await this.videosRepository.findMany({ page, perPage })

    return right({ videos })
  }
}
