import { UseCaseError } from '@/core/errors/use-case-error'
import { PlaylistErrorMessages } from './error-messages'

export class VideoAlreadyInPlaylistError extends Error implements UseCaseError {
  constructor() {
    super(PlaylistErrorMessages.VIDEO_ALREADY_IN_PLAYLIST)
  }
}
