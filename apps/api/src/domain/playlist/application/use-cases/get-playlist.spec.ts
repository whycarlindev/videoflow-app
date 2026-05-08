import { makePlaylist } from 'test/factories/make-playlist'
import { InMemoryPlaylistsRepository } from 'test/repositories/in-memory-playlists-repository'
import { assert } from 'test/utils/assert'
import { GetPlaylistUseCase } from '@/domain/playlist/application/use-cases/get-playlist'

describe('GetPlaylistUseCase', () => {
  let playlistsRepository: InMemoryPlaylistsRepository
  let sut: GetPlaylistUseCase

  beforeEach(() => {
    playlistsRepository = new InMemoryPlaylistsRepository()
    sut = new GetPlaylistUseCase(playlistsRepository)
  })

  it('should be able to get a playlist by id', async () => {
    const playlist = makePlaylist()
    playlistsRepository.items.push(playlist)

    const result = await sut.execute({
      playlistId: playlist.id.toString(),
    })

    assert(result.isRight())
    expect(result.value.playlist.id).toEqual(playlist.id)
  })

  it('should not be able to get if playlist does not exist', async () => {
    const result = await sut.execute({
      playlistId: 'non-existent',
    })

    expect(result.isLeft()).toBe(true)
  })
})
