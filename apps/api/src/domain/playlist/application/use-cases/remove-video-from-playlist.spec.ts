import { makePlaylist } from 'test/factories/make-playlist'
import { InMemoryPlaylistsRepository } from 'test/repositories/in-memory-playlists-repository'
import { assert } from 'test/utils/assert'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { RemoveVideoFromPlaylistUseCase } from '@/domain/playlist/application/use-cases/remove-video-from-playlist'

describe('RemoveVideoFromPlaylistUseCase', () => {
  let playlistsRepository: InMemoryPlaylistsRepository
  let sut: RemoveVideoFromPlaylistUseCase

  beforeEach(() => {
    playlistsRepository = new InMemoryPlaylistsRepository()
    sut = new RemoveVideoFromPlaylistUseCase(playlistsRepository)
  })

  it('should be able to remove a video from a playlist', async () => {
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

    assert(result.isRight())
    expect(result.value.playlist.videos.getItems()).toHaveLength(0)
  })

  it('should not be able to remove if not the author', async () => {
    const videoId = new UniqueEntityId()
    const playlist = makePlaylist()
    playlist.addVideo(videoId)
    playlistsRepository.items.push(playlist)

    const result = await sut.execute({
      playlistId: playlist.id.toString(),
      videoId: videoId.toString(),
      authorId: 'wrong-author',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to remove if playlist does not exist', async () => {
    const result = await sut.execute({
      playlistId: 'non-existent',
      videoId: 'any-video',
      authorId: 'any',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to remove a video that is not in the playlist', async () => {
    const authorId = new UniqueEntityId()
    const playlist = makePlaylist({ authorId })
    playlistsRepository.items.push(playlist)

    const result = await sut.execute({
      playlistId: playlist.id.toString(),
      videoId: new UniqueEntityId().toString(),
      authorId: authorId.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
