import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { assert } from 'test/utils/assert'
import { UpdateUserProfileUseCase } from '@/domain/account/application/use-cases/update-user-profile'

describe('UpdateUserProfileUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: UpdateUserProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserProfileUseCase(usersRepository)
  })

  it('should be able to update bio', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      bio: 'My new bio',
    })

    assert(result.isRight())
    expect(usersRepository.items[0].bio).toBe('My new bio')
  })

  it('should be able to update avatarUrl', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      avatarUrl: 'https://example.com/avatar.png',
    })

    assert(result.isRight())
    expect(usersRepository.items[0].avatarUrl).toBe('https://example.com/avatar.png')
  })

  it('should be able to update both bio and avatarUrl at once', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      bio: 'Updated bio',
      avatarUrl: 'https://example.com/new-avatar.png',
    })

    assert(result.isRight())
    expect(usersRepository.items[0].bio).toBe('Updated bio')
    expect(usersRepository.items[0].avatarUrl).toBe('https://example.com/new-avatar.png')
  })

  it('should not be able to update if user does not exist', async () => {
    const result = await sut.execute({
      userId: 'non-existent',
      bio: 'Some bio',
    })

    expect(result.isLeft()).toBe(true)
  })
})
