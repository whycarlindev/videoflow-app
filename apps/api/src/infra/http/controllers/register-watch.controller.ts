import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post } from '@nestjs/common'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { RegisterWatchUseCase } from '@/domain/watch-history/application/use-cases/register-watch'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { WatchEntryPresenter } from '@/infra/http/presenters/watch-entry-presenter'

const registerWatchBodySchema = z.object({
  videoId: z.string(),
  progressPercentage: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(registerWatchBodySchema)
type RegisterWatchBodySchema = z.infer<typeof registerWatchBodySchema>

@Controller('/watch-history')
export class RegisterWatchController {
  constructor(private registerWatch: RegisterWatchUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: RegisterWatchBodySchema,
  ) {
    const result = await this.registerWatch.execute({
      userId: user.sub,
      videoId: body.videoId,
      progressPercentage: body.progressPercentage,
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

    return {
      watchEntry: WatchEntryPresenter.toHTTP(result.value.watchEntry),
    }
  }
}
