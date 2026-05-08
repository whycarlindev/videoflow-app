import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { UserFactory } from 'test/factories/user-factory'

describe('Get User Profile (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /users/:username', async () => {
    const user = await userFactory.makePrismaUser()

    const response = await request(app.getHttpServer()).get(
      `/users/${user.username.value}`,
    )

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        id: user.id.toString(),
        username: user.username.value,
        email: user.email.value,
      }),
    })
  })

  test('[GET] /users/:username — should not be able to get a non-existent profile', async () => {
    const response = await request(app.getHttpServer()).get(
      '/users/this-username-does-not-exist',
    )

    expect(response.statusCode).toBe(404)
  })
})
