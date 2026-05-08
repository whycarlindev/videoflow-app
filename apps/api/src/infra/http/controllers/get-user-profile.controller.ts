import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetUserProfileUseCase } from '@/domain/account/application/use-cases/get-user-profile'
import { Public } from '@/infra/auth/public-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'

const getUserProfileParamSchema = z.object({
  username: z.string(),
})

const paramValidationPipe = new ZodValidationPipe(getUserProfileParamSchema)
type GetUserProfileParamSchema = z.infer<typeof getUserProfileParamSchema>

@Controller('/users')
export class GetUserProfileController {
  constructor(private getUserProfile: GetUserProfileUseCase) {}

  @Get(':username')
  @Public()
  async handle(@Param(paramValidationPipe) param: GetUserProfileParamSchema) {
    const result = await this.getUserProfile.execute({
      username: param.username,
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
