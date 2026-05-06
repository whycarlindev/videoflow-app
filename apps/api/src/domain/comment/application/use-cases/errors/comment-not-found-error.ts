import { UseCaseError } from '@/core/errors/use-case-error'
import { CommentErrorMessages } from './error-messages'

export class CommentNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(CommentErrorMessages.COMMENT_NOT_FOUND)
  }
}
