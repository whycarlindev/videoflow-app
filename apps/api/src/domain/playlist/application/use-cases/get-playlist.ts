import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Playlist } from '../../enterprise/entities/playlist'
import { PlaylistsRepository } from '../repositories/playlists-repository'

type GetPlaylistUseCaseRequest = {
  playlistId: string
}

type GetPlaylistUseCaseResponse = Either<ResourceNotFoundError, { playlist: Playlist }>

@Injectable()
export class GetPlaylistUseCase {
  constructor(private playlistsRepository: PlaylistsRepository) {}

  async execute({ playlistId }: GetPlaylistUseCaseRequest): Promise<GetPlaylistUseCaseResponse> {
    const playlist = await this.playlistsRepository.findById(playlistId)

    if (!playlist) {
      return left(new ResourceNotFoundError())
    }

    return right({ playlist })
  }
}
