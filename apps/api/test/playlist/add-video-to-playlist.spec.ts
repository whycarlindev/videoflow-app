import { makePlaylist } from 'test/factories/make-playlist'
import { InMemoryPlaylistsRepository } from 'test/repositories/in-memory-playlists-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AddVideoToPlaylistUseCase } from '@/domain/playlist/application/use-cases/add-video-to-playlist'

describe('AddVideoToPlaylistUseCase', () => {
  let playlistsRepository: InMemoryPlaylistsRepository
  let sut: AddVideoToPlaylistUseCase

  beforeEach(() => {
    playlistsRepository = new InMemoryPlaylistsRepository()
    sut = new AddVideoToPlaylistUseCase(playlistsRepository)
  })

  it('should add a video to the playlist', async () => {
    const authorId = new UniqueEntityId()
    const playlist = makePlaylist({ authorId })
    playlistsRepository.items.push(playlist)
    const videoId = new UniqueEntityId()

    const result = await sut.execute({
      playlistId: playlist.id.toString(),
      videoId: videoId.toString(),
      authorId: authorId.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.playlist.videos.getItems()).toHaveLength(1)
    }
  })

  it('should return VideoAlreadyInPlaylistError on duplicate', async () => {
    const authorId = new UniqueEntityId()
    const videoId = new UniqueEntityId()
    const playlist = makePlaylist({ authorId })
    playlist.addVideo(videoId)
    playlistsRepository.items.push(playlist)

    const result = await sut.execute({
      playlistId: playlist.id.toString(),
      videoId: videoId.toString(),
      authorId: authorId.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should return NotAllowedError if not the author', async () => {
    const playlist = makePlaylist()
    playlistsRepository.items.push(playlist)

    const result = await sut.execute({
      playlistId: playlist.id.toString(),
      videoId: 'any-video',
      authorId: 'wrong-author',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should return ResourceNotFoundError if playlist does not exist', async () => {
    const result = await sut.execute({
      playlistId: 'non-existent',
      videoId: 'any-video',
      authorId: 'any',
    })

    expect(result.isLeft()).toBe(true)
  })
})
