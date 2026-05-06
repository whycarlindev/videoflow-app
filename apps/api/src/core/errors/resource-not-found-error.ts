import { CoreErrorMessages } from './error-messages'
import { UseCaseError } from './use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(CoreErrorMessages.RESOURCE_NOT_FOUND)
  }
}
