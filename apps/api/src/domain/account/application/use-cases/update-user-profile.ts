import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'

type UpdateUserProfileUseCaseRequest = {
  userId: string
  bio?: string | null
  avatarUrl?: string | null
}

type UpdateUserProfileUseCaseResponse = Either<ResourceNotFoundError, { user: User }>

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    bio,
    avatarUrl,
  }: UpdateUserProfileUseCaseRequest): Promise<UpdateUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (bio !== undefined) {
      user.updateProfile(bio)
    }

    if (avatarUrl !== undefined) {
      user.changeAvatar(avatarUrl)
    }

    await this.usersRepository.save(user)

    return right({ user })
  }
}
