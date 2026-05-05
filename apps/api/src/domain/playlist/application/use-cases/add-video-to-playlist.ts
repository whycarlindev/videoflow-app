import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Playlist } from '../../enterprise/entities/playlist'
import { PlaylistsRepository } from '../repositories/playlists-repository'
import { VideoAlreadyInPlaylistError } from './errors/video-already-in-playlist-error'

type AddVideoToPlaylistUseCaseRequest = {
  playlistId: string
  videoId: string
  authorId: string
}

type AddVideoToPlaylistUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | VideoAlreadyInPlaylistError,
  { playlist: Playlist }
>

@Injectable()
export class AddVideoToPlaylistUseCase {
  constructor(private playlistsRepository: PlaylistsRepository) {}

  async execute({
    playlistId,
    videoId,
    authorId,
  }: AddVideoToPlaylistUseCaseRequest): Promise<AddVideoToPlaylistUseCaseResponse> {
    const playlist = await this.playlistsRepository.findById(playlistId)

    if (!playlist) {
      return left(new ResourceNotFoundError())
    }

    if (playlist.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const videoEntityId = new UniqueEntityId(videoId)

    if (playlist.hasVideo(videoEntityId)) {
      return left(new VideoAlreadyInPlaylistError())
    }

    playlist.addVideo(videoEntityId)

    await this.playlistsRepository.save(playlist)

    return right({ playlist })
  }
}
