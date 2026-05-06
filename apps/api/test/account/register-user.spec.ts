import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { assert } from 'test/utils/assert'
import { RegisterUserUseCase } from '@/domain/account/application/use-cases/register-user'

describe('RegisterUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: RegisterUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserUseCase(usersRepository)
  })

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      email: 'john@example.com',
      username: 'john_doe',
      passwordHash: 'hashed_password',
    })

    assert(result.isRight())
    expect(result.value.user.email.value).toBe('john@example.com')
    expect(result.value.user.username.value).toBe('john_doe')
    expect(usersRepository.items).toHaveLength(1)
  })

  it('should return UserAlreadyExistsError if email is taken', async () => {
    const existing = makeUser()
    usersRepository.items.push(existing)

    const result = await sut.execute({
      email: existing.email.value,
      username: 'another_user',
      passwordHash: 'hashed',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should return UsernameAlreadyTakenError if username is taken', async () => {
    const existing = makeUser()
    usersRepository.items.push(existing)

    const result = await sut.execute({
      email: 'different@example.com',
      username: existing.username.value,
      passwordHash: 'hashed',
    })

    expect(result.isLeft()).toBe(true)
  })
})
