import { UseCaseError } from '@/core/errors/use-case-error'
import { AccountErrorMessages } from './error-messages'

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super(AccountErrorMessages.WRONG_CREDENTIALS)
  }
}
