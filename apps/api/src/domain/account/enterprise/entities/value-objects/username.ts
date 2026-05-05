import { ValueObject } from '@/core/entities/value-object'

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

  static create(username: string): Username {
    if (!Username.isValid(username)) {
      throw new Error(
        `Invalid username: "${username}". Must be 3-30 alphanumeric characters or underscores.`,
      )
    }
    return new Username({ value: username })
  }
}
