import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'

type DomainEventCallback = (event: DomainEvent) => void

// biome-ignore lint/complexity/noStaticOnlyClass: intentional static event bus (DDD pattern)
export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {}
  private static markedAggregates: AggregateRoot<unknown>[] = []

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>): void {
    const aggregateFound = !!DomainEvents.findMarkedAggregateById(aggregate.id)
    if (!aggregateFound) {
      DomainEvents.markedAggregates.push(aggregate)
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>): void {
    aggregate.domainEvents.forEach((event: DomainEvent) => {
      DomainEvents.dispatch(event)
    })
  }

  private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<unknown>): void {
    const index = DomainEvents.markedAggregates.findIndex((a) => a.equals(aggregate))
    DomainEvents.markedAggregates.splice(index, 1)
  }

  private static findMarkedAggregateById(id: UniqueEntityId): AggregateRoot<unknown> | undefined {
    return DomainEvents.markedAggregates.find((a) => a.id.equals(id))
  }

  public static dispatchEventsForAggregate(id: UniqueEntityId): void {
    const aggregate = DomainEvents.findMarkedAggregateById(id)
    if (aggregate) {
      DomainEvents.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      DomainEvents.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  public static register(callback: DomainEventCallback, eventClassName: string): void {
    const wasEventRegisteredBefore = eventClassName in DomainEvents.handlersMap
    if (!wasEventRegisteredBefore) {
      DomainEvents.handlersMap[eventClassName] = []
    }
    DomainEvents.handlersMap[eventClassName].push(callback)
  }

  public static clearHandlers(): void {
    DomainEvents.handlersMap = {}
  }

  public static clearMarkedAggregates(): void {
    DomainEvents.markedAggregates = []
  }

  private static dispatch(event: DomainEvent): void {
    const eventClassName: string = event.constructor.name
    const isEventRegistered = eventClassName in DomainEvents.handlersMap
    if (isEventRegistered) {
      const handlers = DomainEvents.handlersMap[eventClassName]
      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
