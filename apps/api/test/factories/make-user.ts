import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/account/enterprise/entities/user'
import { Email } from '@/domain/account/enterprise/entities/value-objects/email'
import { Username } from '@/domain/account/enterprise/entities/value-objects/username'

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityId): User {
  return User.create(
    {
      email: Email.create(`user_${Math.random().toString(36).slice(2)}@example.com`),
      username: Username.create(`usr_${Math.random().toString(36).slice(2, 10)}`),
      passwordHash: 'hashed_password',
      ...override,
    },
    id,
  )
}
