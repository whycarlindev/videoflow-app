import { InMemoryPlaylistsRepository } from 'test/repositories/in-memory-playlists-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreatePlaylistUseCase } from '@/domain/playlist/application/use-cases/create-playlist'

describe('CreatePlaylistUseCase', () => {
  let playlistsRepository: InMemoryPlaylistsRepository
  let sut: CreatePlaylistUseCase

  beforeEach(() => {
    playlistsRepository = new InMemoryPlaylistsRepository()
    sut = new CreatePlaylistUseCase(playlistsRepository)
  })

  it('should create a playlist', async () => {
    const result = await sut.execute({
      title: 'My Favorites',
      authorId: 'user-1',
      isPublic: true,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.playlist.title).toBe('My Favorites')
      expect(result.value.playlist.isPublic).toBe(true)
      expect(playlistsRepository.items).toHaveLength(1)
    }
  })

  it('should create a private playlist by default when isPublic is false', async () => {
    const result = await sut.execute({
      title: 'Private List',
      authorId: 'user-1',
      isPublic: false,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.playlist.isPublic).toBe(false)
    }
  })
})
