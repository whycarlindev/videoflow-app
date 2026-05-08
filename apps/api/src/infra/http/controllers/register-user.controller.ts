import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { RegisterUserUseCase } from '@/domain/account/application/use-cases/register-user'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator'
import { UserAlreadyExistsError } from '@/domain/account/application/use-cases/errors/user-already-exists-error'
import { UsernameAlreadyTakenError } from '@/domain/account/application/use-cases/errors/username-already-taken-error'
import { InvalidEmailError } from '@/domain/account/enterprise/errors/invalid-email-error'
import { InvalidUsernameError } from '@/domain/account/enterprise/errors/invalid-username-error'
import { Public } from '@/infra/auth/public-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'

const registerUserBodySchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(registerUserBodySchema)
type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>

@Controller('/users')
export class RegisterUserController {
  constructor(
    private registerUser: RegisterUserUseCase,
    private hashGenerator: HashGenerator,
  ) {}

  @Post()
  @HttpCode(201)
  @Public()
  async handle(@Body(bodyValidationPipe) body: RegisterUserBodySchema) {
    const passwordHash = await this.hashGenerator.hash(body.password)

    const result = await this.registerUser.execute({
      email: body.email,
      username: body.username,
      passwordHash,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        case UsernameAlreadyTakenError:
          throw new ConflictException(error.message)
        case InvalidEmailError:
          throw new BadRequestException(error.message)
        case InvalidUsernameError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      user: UserPresenter.toHTTP(result.value.user),
    }
  }
}
