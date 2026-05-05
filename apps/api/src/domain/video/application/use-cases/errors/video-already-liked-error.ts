import { UseCaseError } from '@/core/errors/use-case-error'

export class VideoAlreadyLikedError extends Error implements UseCaseError {
  constructor() {
    super('Video already liked by this user')
  }
}
