import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnfollowUserUseCase } from '@/domain/account/application/use-cases/unfollow-user'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const unfollowUserParamSchema = z.object({
  channelId: z.string(),
})

const paramValidationPipe = new ZodValidationPipe(unfollowUserParamSchema)
type UnfollowUserParamSchema = z.infer<typeof unfollowUserParamSchema>

@Controller('/users/:channelId/follow')
export class UnfollowUserController {
  constructor(private unfollowUser: UnfollowUserUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(paramValidationPipe) param: UnfollowUserParamSchema,
  ) {
    const result = await this.unfollowUser.execute({
      subscriberId: user.sub,
      channelId: param.channelId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
