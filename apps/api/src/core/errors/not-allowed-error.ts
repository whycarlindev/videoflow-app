import { CoreErrorMessages } from './error-messages'
import { UseCaseError } from './use-case-error'

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super(CoreErrorMessages.NOT_ALLOWED)
  }
}
