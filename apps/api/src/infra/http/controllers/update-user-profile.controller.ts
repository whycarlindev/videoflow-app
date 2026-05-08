import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UpdateUserProfileUseCase } from '@/domain/account/application/use-cases/update-user-profile'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'

const updateUserProfileBodySchema = z.object({
  bio: z.string().nullish(),
  avatarUrl: z.string().nullish(),
})

const bodyValidationPipe = new ZodValidationPipe(updateUserProfileBodySchema)
type UpdateUserProfileBodySchema = z.infer<typeof updateUserProfileBodySchema>

@Controller('/users/me')
export class UpdateUserProfileController {
  constructor(private updateUserProfile: UpdateUserProfileUseCase) {}

  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: UpdateUserProfileBodySchema,
  ) {
    const result = await this.updateUserProfile.execute({
      userId: user.sub,
      bio: body.bio,
      avatarUrl: body.avatarUrl,
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
      user: UserPresenter.toHTTP(result.value.user),
    }
  }
}
