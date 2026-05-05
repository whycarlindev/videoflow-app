import { UseCaseError } from '@/core/errors/use-case-error'

export class VideoNotAvailableError extends Error implements UseCaseError {
  constructor() {
    super('Video is not available')
  }
}
