import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { assert } from 'test/utils/assert'
import { GetUserProfileUseCase } from '@/domain/account/application/use-cases/get-user-profile'

describe('GetUserProfileUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: GetUserProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get a user profile by username', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      username: user.username.value,
    })

    assert(result.isRight())
    expect(result.value.user.username.value).toBe(user.username.value)
  })

  it('should not be able to get if user does not exist', async () => {
    const result = await sut.execute({
      username: 'non-existent-user',
    })

    expect(result.isLeft()).toBe(true)
  })
})
