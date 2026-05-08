export const AccountErrorMessages = {
  USER_ALREADY_EXISTS: (identifier: string) => `User with "${identifier}" already exists`,
  USERNAME_ALREADY_TAKEN: (username: string) => `Username "${username}" is already taken`,
  ALREADY_FOLLOWING: 'Already following this channel',
  WRONG_CREDENTIALS: 'Wrong credentials.',
} as const
