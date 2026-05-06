import { UseCaseError } from '@/core/errors/use-case-error'
import { VideoErrorMessages } from './error-messages'

export class VideoAlreadyLikedError extends Error implements UseCaseError {
  constructor() {
    super(VideoErrorMessages.VIDEO_ALREADY_LIKED)
  }
}
