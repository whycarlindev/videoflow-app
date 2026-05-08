import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { GetUserWatchHistoryUseCase } from '@/domain/watch-history/application/use-cases/get-user-watch-history'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/user-payload'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { WatchEntryPresenter } from '@/infra/http/presenters/watch-entry-presenter'

const getUserWatchHistoryQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  perPage: z.coerce.number().optional(),
})

const queryValidationPipe = new ZodValidationPipe(getUserWatchHistoryQuerySchema)
type GetUserWatchHistoryQuerySchema = z.infer<typeof getUserWatchHistoryQuerySchema>

@Controller('/watch-history')
export class GetUserWatchHistoryController {
  constructor(private getUserWatchHistory: GetUserWatchHistoryUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) query: GetUserWatchHistoryQuerySchema,
  ) {
    const result = await this.getUserWatchHistory.execute({
      userId: user.sub,
      page: query.page,
      perPage: query.perPage,
    })

    return {
      watchHistory: result.value.watchHistory.map(WatchEntryPresenter.toHTTP),
    }
  }
}
