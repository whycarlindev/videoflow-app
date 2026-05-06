import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { User } from '../../enterprise/entities/user'
import { InvalidEmailError } from '../../enterprise/errors/invalid-email-error'
import { InvalidUsernameError } from '../../enterprise/errors/invalid-username-error'
import { Email } from '../../enterprise/entities/value-objects/email'
import { Username } from '../../enterprise/entities/value-objects/username'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { UsernameAlreadyTakenError } from './errors/username-already-taken-error'

type RegisterUserUseCaseRequest = {
  email: string
  username: string
  passwordHash: string
}

type RegisterUserUseCaseResponse = Either<
  InvalidEmailError | InvalidUsernameError | UserAlreadyExistsError | UsernameAlreadyTakenError,
  { user: User }
>

@Injectable()
export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    username,
    passwordHash,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const emailResult = Email.create(email)
    if (emailResult.isLeft()) return left(emailResult.value)

    const usernameResult = Username.create(username)
    if (usernameResult.isLeft()) return left(usernameResult.value)

    const emailVO = emailResult.value
    const usernameVO = usernameResult.value

    const existingByEmail = await this.usersRepository.findByEmail(emailVO.value)

    if (existingByEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const existingByUsername = await this.usersRepository.findByUsername(usernameVO.value)

    if (existingByUsername) {
      return left(new UsernameAlreadyTakenError(username))
    }

    const user = User.create({
      email: emailVO,
      username: usernameVO,
      passwordHash,
    })

    await this.usersRepository.create(user)

    return right({ user })
  }
}
