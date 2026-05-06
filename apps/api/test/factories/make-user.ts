import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/account/enterprise/entities/user'
import { Email } from '@/domain/account/enterprise/entities/value-objects/email'
import { Username } from '@/domain/account/enterprise/entities/value-objects/username'

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityId): User {
  const emailResult = Email.create(`user_${Math.random().toString(36).slice(2)}@example.com`)
  const usernameResult = Username.create(`usr_${Math.random().toString(36).slice(2, 10)}`)

  if (emailResult.isLeft()) throw new Error('makeUser: invalid test email')
  if (usernameResult.isLeft()) throw new Error('makeUser: invalid test username')

  return User.create(
    {
      email: emailResult.value,
      username: usernameResult.value,
      passwordHash: 'hashed_password',
      ...override,
    },
    id,
  )
}
