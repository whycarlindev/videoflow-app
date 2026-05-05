import { UseCaseError } from '@/core/errors/use-case-error'

export class CommentNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Comment not found')
  }
}
