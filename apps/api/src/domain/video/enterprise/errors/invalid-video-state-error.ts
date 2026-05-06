import { UseCaseError } from '@/core/errors/use-case-error'
import { VideoEnterpriseErrorMessages } from './error-messages'

export class InvalidVideoStateError extends Error implements UseCaseError {
  constructor() {
    super(VideoEnterpriseErrorMessages.INVALID_VIDEO_STATE)
  }
}
