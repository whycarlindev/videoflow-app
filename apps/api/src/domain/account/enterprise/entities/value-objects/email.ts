import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-object'
import { InvalidEmailError } from '../../errors/invalid-email-error'

interface EmailProps {
  value: string
}

export class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: EmailProps) {
    super(props)
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static create(email: string): Either<InvalidEmailError, Email> {
    const normalized = email.trim().toLowerCase()
    if (!Email.isValid(normalized)) {
      return left(new InvalidEmailError())
    }
    return right(new Email({ value: normalized }))
  }
}
