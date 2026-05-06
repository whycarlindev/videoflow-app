import { UseCaseError } from '@/core/errors/use-case-error'
import { AccountErrorMessages } from './error-messages'

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(AccountErrorMessages.USER_ALREADY_EXISTS(identifier))
  }
}
