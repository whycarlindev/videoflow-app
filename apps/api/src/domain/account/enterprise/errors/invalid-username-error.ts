import { UseCaseError } from '@/core/errors/use-case-error'
import { AccountEnterpriseErrorMessages } from './error-messages'

export class InvalidUsernameError extends Error implements UseCaseError {
  constructor() {
    super(AccountEnterpriseErrorMessages.INVALID_USERNAME)
  }
}
