import { UseCaseError } from '@/core/errors/use-case-error'
import { CommentErrorMessages } from './error-messages'

export class CommentAlreadyLikedError extends Error implements UseCaseError {
  constructor() {
    super(CommentErrorMessages.COMMENT_ALREADY_LIKED)
  }
}
