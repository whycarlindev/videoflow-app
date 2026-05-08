import { Injectable, OnModuleInit } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { UserFollowedEvent } from '@/domain/account/enterprise/events/user-followed-event'

@Injectable()
export class OnUserFollowed implements EventHandler, OnModuleInit {
  onModuleInit() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.handle(event as UserFollowedEvent),
      UserFollowedEvent.name,
    )
  }

  private handle(event: UserFollowedEvent): void {
    console.log(
      `[OnUserFollowed] User ${event.subscriberId.toString()} followed ${event.channelId.toString()}`,
    )
  }
}
