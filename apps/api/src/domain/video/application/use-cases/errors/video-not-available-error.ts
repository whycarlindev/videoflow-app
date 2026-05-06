import { UseCaseError } from '@/core/errors/use-case-error'
import { VideoErrorMessages } from './error-messages'

export class VideoNotAvailableError extends Error implements UseCaseError {
  constructor() {
    super(VideoErrorMessages.VIDEO_NOT_AVAILABLE)
  }
}
