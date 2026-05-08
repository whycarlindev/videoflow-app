import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetPlaylistUseCase } from '@/domain/playlist/application/use-cases/get-playlist'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { PlaylistPresenter } from '@/infra/http/presenters/playlist-presenter'

@Controller('/playlists/:playlistId')
export class GetPlaylistController {
  constructor(private getPlaylist: GetPlaylistUseCase) {}

  @Get()
  async handle(
    @CurrentUser() _user: UserPayload,
    @Param('playlistId') playlistId: string,
  ) {
    const result = await this.getPlaylist.execute({ playlistId })

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
      playlist: PlaylistPresenter.toHTTP(result.value.playlist),
    }
  }
}
