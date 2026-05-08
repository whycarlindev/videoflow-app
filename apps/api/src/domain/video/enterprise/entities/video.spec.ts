import { makeVideo } from 'test/factories/make-video'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { VideoStatus } from '@/domain/video/enterprise/entities/value-objects/video-status'
import { VideoTagsList } from '@/domain/video/enterprise/entities/video-tags-list'

describe('Video entity', () => {
  it('should start with pending status', () => {
    const video = makeVideo()
    expect(video.status.isPending()).toBe(true)
  })

  it('should auto-generate slug from title', () => {
    const video = makeVideo({ title: 'Hello World Video' })
    expect(video.slug.value).toBe('hello-world-video')
  })

  it('should publish and emit VideoPublishedEvent', () => {
    const video = makeVideo()
    const result = video.publish()
    expect(result.isRight()).toBe(true)
    expect(video.status.isPublished()).toBe(true)
    // VideoCreatedEvent (on create) + VideoPublishedEvent (on publish)
    expect(video.domainEvents).toHaveLength(2)
  })

  it('should not be able to publish an already published video', () => {
    const video = makeVideo({ status: VideoStatus.published() })
    const result = video.publish()
    expect(result.isLeft()).toBe(true)
  })

  it('should soft-delete a video', () => {
    const video = makeVideo()
    video.delete()
    expect(video.status.isDeleted()).toBe(true)
  })

  it('should increment views count', () => {
    const video = makeVideo()
    video.incrementViews()
    video.incrementViews()
    expect(video.viewsCount).toBe(2)
  })

  it('should add and remove likes', () => {
    const video = makeVideo()
    const userId = new UniqueEntityId('user-1')
    video.addLike(userId)
    expect(video.likesCount).toBe(1)
    video.removeLike()
    expect(video.likesCount).toBe(0)
  })

  it('should not go below 0 on removeLike', () => {
    const video = makeVideo()
    video.removeLike()
    expect(video.likesCount).toBe(0)
  })

  it('should update tags using WatchedList — track new and removed items', () => {
    // Seed initial tags so WatchedList can detect them as "removed" (not just "un-added")
    const initialTags = new VideoTagsList(['nodejs', 'typescript'])
    const video = makeVideo({ tags: initialTags })

    video.updateTags(['typescript', 'ddd'])

    expect(video.tags.getItems()).toEqual(['typescript', 'ddd'])
    // 'ddd' was not in the initial list → it is a genuinely new item
    expect(video.tags.getNewItems()).toContain('ddd')
    // 'nodejs' was in the initial list and is now absent → it is removed
    expect(video.tags.getRemovedItems()).toContain('nodejs')
    // 'typescript' survived the update → it is neither new nor removed
    expect(video.tags.getNewItems()).not.toContain('typescript')
    expect(video.tags.getRemovedItems()).not.toContain('typescript')
  })

  it('should update slug when title changes', () => {
    const video = makeVideo({ title: 'Old Title' })
    video.title = 'New Amazing Title'
    expect(video.slug.value).toBe('new-amazing-title')
  })
})
