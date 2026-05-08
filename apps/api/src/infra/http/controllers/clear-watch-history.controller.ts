import { Controller, Delete, HttpCode } from '@nestjs/common'
import { ClearWatchHistoryUseCase } from '@/domain/watch-history/application/use-cases/clear-watch-history'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'

@Controller('/watch-history')
export class ClearWatchHistoryController {
  constructor(private clearWatchHistory: ClearWatchHistoryUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.clearWatchHistory.execute({
      userId: user.sub,
    })

    if (result.isLeft()) {
      return
    }
  }
}
