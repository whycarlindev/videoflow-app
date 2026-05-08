import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'
import { CreatePlaylistUseCase } from '@/domain/playlist/application/use-cases/create-playlist'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PlaylistPresenter } from '@/infra/http/presenters/playlist-presenter'

const createPlaylistBodySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createPlaylistBodySchema)
type CreatePlaylistBodySchema = z.infer<typeof createPlaylistBodySchema>

@Controller('/playlists')
export class CreatePlaylistController {
  constructor(private createPlaylist: CreatePlaylistUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreatePlaylistBodySchema,
  ) {
    const result = await this.createPlaylist.execute({
      title: body.title,
      description: body.description,
      isPublic: body.isPublic,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException('An unexpected error occurred')
    }

    return {
      playlist: PlaylistPresenter.toHTTP(result.value.playlist),
    }
  }
}
