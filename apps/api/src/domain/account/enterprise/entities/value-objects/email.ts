import { ValueObject } from '@/core/entities/value-object'

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

  static create(email: string): Email {
    const normalized = email.trim().toLowerCase()
    if (!Email.isValid(normalized)) {
      throw new Error(`Invalid email: ${email}`)
    }
    return new Email({ value: normalized })
  }
}
