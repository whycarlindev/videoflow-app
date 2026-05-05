import { UseCaseError } from '@/core/errors/use-case-error'

export class AlreadyFollowingError extends Error implements UseCaseError {
  constructor() {
    super('Already following this channel')
  }
}
