import { UseCaseError } from '@/core/errors/use-case-error'
import { AccountErrorMessages } from './error-messages'

export class UsernameAlreadyTakenError extends Error implements UseCaseError {
  constructor(username: string) {
    super(AccountErrorMessages.USERNAME_ALREADY_TAKEN(username))
  }
}
