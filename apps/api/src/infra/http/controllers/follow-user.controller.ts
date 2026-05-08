import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FollowUserUseCase } from '@/domain/account/application/use-cases/follow-user'
import { AlreadyFollowingError } from '@/domain/account/application/use-cases/errors/already-following-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const followUserParamSchema = z.object({
  channelId: z.string(),
})

const paramValidationPipe = new ZodValidationPipe(followUserParamSchema)
type FollowUserParamSchema = z.infer<typeof followUserParamSchema>

@Controller('/users/:channelId/follow')
export class FollowUserController {
  constructor(private followUser: FollowUserUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(paramValidationPipe) param: FollowUserParamSchema,
  ) {
    const result = await this.followUser.execute({
      subscriberId: user.sub,
      channelId: param.channelId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case AlreadyFollowingError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
