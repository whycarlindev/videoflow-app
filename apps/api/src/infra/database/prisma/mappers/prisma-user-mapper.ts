import { User as PrismaUser } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/account/enterprise/entities/user'
import { Email } from '@/domain/account/enterprise/entities/value-objects/email'
import { Username } from '@/domain/account/enterprise/entities/value-objects/username'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    const emailResult = Email.create(raw.email)
    const usernameResult = Username.create(raw.username)

    if (emailResult.isLeft()) throw new Error(`Invalid email from database: ${raw.email}`)
    if (usernameResult.isLeft()) throw new Error(`Invalid username from database: ${raw.username}`)

    return User.create(
      {
        email: emailResult.value,
        username: usernameResult.value,
        passwordHash: raw.passwordHash,
        avatarUrl: raw.avatarUrl,
        bio: raw.bio,
        subscribersCount: raw.subscribersCount,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(user: User) {
    return {
      id: user.id.toString(),
      email: user.email.value,
      username: user.username.value,
      passwordHash: user.passwordHash,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      subscribersCount: user.subscribersCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
