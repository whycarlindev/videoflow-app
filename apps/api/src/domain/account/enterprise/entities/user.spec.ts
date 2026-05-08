import { makeUser } from 'test/factories/make-user'

describe('User entity (rich domain model)', () => {
  it('should start with zero subscribers', () => {
    const user = makeUser()
    expect(user.subscribersCount).toBe(0)
  })

  it('should increment and decrement subscribers', () => {
    const user = makeUser()
    user.incrementSubscribers()
    user.incrementSubscribers()
    expect(user.subscribersCount).toBe(2)
    user.decrementSubscribers()
    expect(user.subscribersCount).toBe(1)
  })

  it('should not go below 0 on decrementSubscribers', () => {
    const user = makeUser()
    user.decrementSubscribers()
    expect(user.subscribersCount).toBe(0)
  })

  it('should update profile bio', () => {
    const user = makeUser()
    user.updateProfile('New bio')
    expect(user.bio).toBe('New bio')
    expect(user.updatedAt).toBeDefined()
  })

  it('should change avatar', () => {
    const user = makeUser()
    user.changeAvatar('https://cdn.example.com/avatar.png')
    expect(user.avatarUrl).toBe('https://cdn.example.com/avatar.png')
  })

  it('should emit UserCreatedEvent on creation', () => {
    const user = makeUser()
    expect(user.domainEvents).toHaveLength(1)
    expect(user.domainEvents[0].constructor.name).toBe('UserCreatedEvent')
  })
})
