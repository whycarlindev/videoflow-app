import { User } from '@/domain/account/enterprise/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      email: user.email.value,
      username: user.username.value,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      subscribersCount: user.subscribersCount,
      createdAt: user.createdAt,
    }
  }
}
