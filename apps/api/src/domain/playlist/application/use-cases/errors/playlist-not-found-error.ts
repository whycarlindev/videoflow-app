import { UseCaseError } from '@/core/errors/use-case-error'
import { PlaylistErrorMessages } from './error-messages'

export class PlaylistNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(PlaylistErrorMessages.PLAYLIST_NOT_FOUND)
  }
}
