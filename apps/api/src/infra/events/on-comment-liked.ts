import { Injectable, OnModuleInit } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CommentLikedEvent } from '@/domain/comment/enterprise/events/comment-liked-event'

@Injectable()
export class OnCommentLiked implements EventHandler, OnModuleInit {
  onModuleInit() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.handle(event as CommentLikedEvent),
      CommentLikedEvent.name,
    )
  }

  private handle(event: CommentLikedEvent): void {
    console.log(
      `[OnCommentLiked] Comment ${event.comment.id.toString()} liked by ${event.userId.toString()}`,
    )
  }
}
