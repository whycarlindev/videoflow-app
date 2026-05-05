import { DomainEvents } from '@/core/events/domain-events'
import { UsersRepository } from '@/domain/account/application/repositories/users-repository'
import { User } from '@/domain/account/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string): Promise<User | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((item) => item.email.value === email) ?? null
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.items.find((item) => item.username.value === username) ?? null
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
    DomainEvents.dispatchEventsForAggregate(user.id)
  }

  async save(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(user.id))
    if (index >= 0) {
      this.items[index] = user
    }
    DomainEvents.dispatchEventsForAggregate(user.id)
  }
}
