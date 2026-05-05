import { UseCaseError } from '@/core/errors/use-case-error'

export class VideoAlreadyInPlaylistError extends Error implements UseCaseError {
  constructor() {
    super('Video is already in this playlist')
  }
}
