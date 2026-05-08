import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { assert } from 'test/utils/assert'
import { AuthenticateUserUseCase } from '@/domain/account/application/use-cases/authenticate-user'
import { WrongCredentialsError } from '@/domain/account/application/use-cases/errors/wrong-credentials-error'

describe('AuthenticateUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let fakeHasher: FakeHasher
  let fakeEncrypter: FakeEncrypter
  let sut: AuthenticateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(usersRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate a user', async () => {
    const user = makeUser({ passwordHash: await fakeHasher.hash('123456') })
    usersRepository.items.push(user)

    const result = await sut.execute({
      email: user.email.value,
      password: '123456',
    })

    assert(result.isRight())
    expect(result.value.accessToken).toEqual(
      JSON.stringify({ sub: user.id.toString() }),
    )
  })

  it('should not be able to authenticate with wrong email', async () => {
    const result = await sut.execute({
      email: 'nonexistent@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const user = makeUser({ passwordHash: await fakeHasher.hash('123456') })
    usersRepository.items.push(user)

    const result = await sut.execute({
      email: user.email.value,
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
