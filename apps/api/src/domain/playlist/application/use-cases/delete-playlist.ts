import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { PlaylistsRepository } from '../repositories/playlists-repository'

type DeletePlaylistUseCaseRequest = {
  playlistId: string
  authorId: string
}

type DeletePlaylistUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null>

@Injectable()
export class DeletePlaylistUseCase {
  constructor(private playlistsRepository: PlaylistsRepository) {}

  async execute({
    playlistId,
    authorId,
  }: DeletePlaylistUseCaseRequest): Promise<DeletePlaylistUseCaseResponse> {
    const playlist = await this.playlistsRepository.findById(playlistId)

    if (!playlist) {
      return left(new ResourceNotFoundError())
    }

    if (playlist.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.playlistsRepository.delete(playlist)

    return right(null)
  }
}
