import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Playlist } from '../../enterprise/entities/playlist'
import { PlaylistsRepository } from '../repositories/playlists-repository'

type CreatePlaylistUseCaseRequest = {
  title: string
  description?: string
  authorId: string
  isPublic?: boolean
}

type CreatePlaylistUseCaseResponse = Either<never, { playlist: Playlist }>

@Injectable()
export class CreatePlaylistUseCase {
  constructor(private playlistsRepository: PlaylistsRepository) {}

  async execute({
    title,
    description,
    authorId,
    isPublic = true,
  }: CreatePlaylistUseCaseRequest): Promise<CreatePlaylistUseCaseResponse> {
    const playlist = Playlist.create({
      title,
      description: description ?? null,
      authorId: new UniqueEntityId(authorId),
      isPublic,
    })

    await this.playlistsRepository.create(playlist)

    return right({ playlist })
  }
}
