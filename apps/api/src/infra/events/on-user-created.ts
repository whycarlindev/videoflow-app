import { Injectable, OnModuleInit } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { UserCreatedEvent } from '@/domain/account/enterprise/events/user-created-event'

@Injectable()
export class OnUserCreated implements EventHandler, OnModuleInit {
  onModuleInit() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.handle(event as UserCreatedEvent),
      UserCreatedEvent.name,
    )
  }

  private handle(event: UserCreatedEvent): void {
    console.log(`[OnUserCreated] New user created: ${event.user.id.toString()}`)
  }
}
