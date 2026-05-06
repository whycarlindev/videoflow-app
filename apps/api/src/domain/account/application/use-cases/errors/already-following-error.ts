import { UseCaseError } from '@/core/errors/use-case-error'
import { AccountErrorMessages } from './error-messages'

export class AlreadyFollowingError extends Error implements UseCaseError {
  constructor() {
    super(AccountErrorMessages.ALREADY_FOLLOWING)
  }
}
