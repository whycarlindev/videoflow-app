import { InMemoryPlaylistsRepository } from 'test/repositories/in-memory-playlists-repository'
import { assert } from 'test/utils/assert'
import { CreatePlaylistUseCase } from '@/domain/playlist/application/use-cases/create-playlist'

describe('CreatePlaylistUseCase', () => {
  let playlistsRepository: InMemoryPlaylistsRepository
  let sut: CreatePlaylistUseCase

  beforeEach(() => {
    playlistsRepository = new InMemoryPlaylistsRepository()
    sut = new CreatePlaylistUseCase(playlistsRepository)
  })

  it('should be able to create a playlist', async () => {
    const result = await sut.execute({
      title: 'My Favorites',
      authorId: 'user-1',
      isPublic: true,
    })

    assert(result.isRight())
    expect(result.value.playlist.title).toBe('My Favorites')
    expect(result.value.playlist.isPublic).toBe(true)
    expect(playlistsRepository.items).toHaveLength(1)
  })

  it('should be able to create a private playlist when isPublic is false', async () => {
    const result = await sut.execute({
      title: 'Private List',
      authorId: 'user-1',
      isPublic: false,
    })

    assert(result.isRight())
    expect(result.value.playlist.isPublic).toBe(false)
  })
})
