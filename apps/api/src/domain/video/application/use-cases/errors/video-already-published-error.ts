import { UseCaseError } from '@/core/errors/use-case-error'

export class VideoAlreadyPublishedError extends Error implements UseCaseError {
  constructor() {
    super('Video is already published')
  }
}
