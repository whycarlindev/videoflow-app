import { UseCaseError } from '@/core/errors/use-case-error'
import { AccountEnterpriseErrorMessages } from './error-messages'

export class InvalidEmailError extends Error implements UseCaseError {
  constructor() {
    super(AccountEnterpriseErrorMessages.INVALID_EMAIL)
  }
}
