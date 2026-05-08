import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { AuthenticateUserUseCase } from '@/domain/account/application/use-cases/authenticate-user'
import { WrongCredentialsError } from '@/domain/account/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const authenticateUserBodySchema = z.object({
  email: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateUserBodySchema)
type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>

@Controller('/sessions')
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @Public()
  async handle(@Body(bodyValidationPipe) body: AuthenticateUserBodySchema) {
    const result = await this.authenticateUser.execute({
      email: body.email,
      password: body.password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      accessToken: result.value.accessToken,
    }
  }
}
