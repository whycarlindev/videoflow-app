import { UseCaseError } from '@/core/errors/use-case-error'

export class UsernameAlreadyTakenError extends Error implements UseCaseError {
  constructor(username: string) {
    super(`Username "${username}" is already taken`)
  }
}
