import { UseCaseError } from '@/core/errors/use-case-error'
import { VideoEnterpriseErrorMessages } from './error-messages'

export class InvalidDurationError extends Error implements UseCaseError {
  constructor() {
    super(VideoEnterpriseErrorMessages.INVALID_DURATION)
  }
}
