import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'
import { InvalidUsernameError } from '../../errors/invalid-username-error'

interface UsernameProps {
  value: string
}

export class Username extends ValueObject<UsernameProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: UsernameProps) {
    super(props)
  }

  private static isValid(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
    return usernameRegex.test(username)
  }

  static create(username: string): Either<InvalidUsernameError, Username> {
    if (!Username.isValid(username)) {
      return left(new InvalidUsernameError())
    }
    return right(new Username({ value: username }))
  }
}
