import { makePlaylist } from 'test/factories/make-playlist'
import { InMemoryPlaylistsRepository } from 'test/repositories/in-memory-playlists-repository'
import { assert } from 'test/utils/assert'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeletePlaylistUseCase } from '@/domain/playlist/application/use-cases/delete-playlist'

describe('DeletePlaylistUseCase', () => {
  let playlistsRepository: InMemoryPlaylistsRepository
  let sut: DeletePlaylistUseCase

  beforeEach(() => {
    playlistsRepository = new InMemoryPlaylistsRepository()
    sut = new DeletePlaylistUseCase(playlistsRepository)
  })

  it('should be able to delete a playlist', async () => {
    const authorId = new UniqueEntityId()
    const playlist = makePlaylist({ authorId })
    playlistsRepository.items.push(playlist)

    const result = await sut.execute({
      playlistId: playlist.id.toString(),
      authorId: authorId.toString(),
    })

    assert(result.isRight())
    expect(playlistsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete if not the author', async () => {
    const playlist = makePlaylist()
    playlistsRepository.items.push(playlist)

    const result = await sut.execute({
      playlistId: playlist.id.toString(),
      authorId: 'wrong-author',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete if playlist does not exist', async () => {
    const result = await sut.execute({
      playlistId: 'non-existent',
      authorId: 'any',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
