import { UseCaseError } from '@/core/errors/use-case-error'

export class PlaylistNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Playlist not found')
  }
}
