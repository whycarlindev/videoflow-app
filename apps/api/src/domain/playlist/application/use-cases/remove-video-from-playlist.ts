import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Playlist } from '../../enterprise/entities/playlist'
import { PlaylistsRepository } from '../repositories/playlists-repository'

type RemoveVideoFromPlaylistUseCaseRequest = {
  playlistId: string
  videoId: string
  authorId: string
}

type RemoveVideoFromPlaylistUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { playlist: Playlist }
>

@Injectable()
export class RemoveVideoFromPlaylistUseCase {
  constructor(private playlistsRepository: PlaylistsRepository) {}

  async execute({
    playlistId,
    videoId,
    authorId,
  }: RemoveVideoFromPlaylistUseCaseRequest): Promise<RemoveVideoFromPlaylistUseCaseResponse> {
    const playlist = await this.playlistsRepository.findById(playlistId)

    if (!playlist) {
      return left(new ResourceNotFoundError())
    }

    if (playlist.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const videoEntityId = new UniqueEntityId(videoId)

    if (!playlist.hasVideo(videoEntityId)) {
      return left(new ResourceNotFoundError())
    }

    playlist.removeVideo(videoEntityId)

    await this.playlistsRepository.save(playlist)

    return right({ playlist })
  }
}
