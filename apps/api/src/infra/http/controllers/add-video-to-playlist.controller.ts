import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AddVideoToPlaylistUseCase } from '@/domain/playlist/application/use-cases/add-video-to-playlist'
import { VideoAlreadyInPlaylistError } from '@/domain/playlist/application/use-cases/errors/video-already-in-playlist-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PlaylistPresenter } from '@/infra/http/presenters/playlist-presenter'

const addVideoToPlaylistBodySchema = z.object({
  videoId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(addVideoToPlaylistBodySchema)
type AddVideoToPlaylistBodySchema = z.infer<typeof addVideoToPlaylistBodySchema>

@Controller('/playlists/:playlistId/videos')
export class AddVideoToPlaylistController {
  constructor(private addVideoToPlaylist: AddVideoToPlaylistUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('playlistId') playlistId: string,
    @Body(bodyValidationPipe) body: AddVideoToPlaylistBodySchema,
  ) {
    const result = await this.addVideoToPlaylist.execute({
      playlistId,
      videoId: body.videoId,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        case VideoAlreadyInPlaylistError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      playlist: PlaylistPresenter.toHTTP(result.value.playlist),
    }
  }
}
