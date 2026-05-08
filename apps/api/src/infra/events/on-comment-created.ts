import { Injectable, OnModuleInit } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CommentCreatedEvent } from '@/domain/comment/enterprise/events/comment-created-event'

@Injectable()
export class OnCommentCreated implements EventHandler, OnModuleInit {
  onModuleInit() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.handle(event as CommentCreatedEvent),
      CommentCreatedEvent.name,
    )
  }

  private handle(event: CommentCreatedEvent): void {
    console.log(`[OnCommentCreated] Comment created: ${event.comment.id.toString()}`)
  }
}
