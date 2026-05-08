import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { RemoveVideoFromPlaylistUseCase } from '@/domain/playlist/application/use-cases/remove-video-from-playlist'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'

@Controller('/playlists/:playlistId/videos/:videoId')
export class RemoveVideoFromPlaylistController {
  constructor(private removeVideoFromPlaylist: RemoveVideoFromPlaylistUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('playlistId') playlistId: string,
    @Param('videoId') videoId: string,
  ) {
    const result = await this.removeVideoFromPlaylist.execute({
      playlistId,
      videoId,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
