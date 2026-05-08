import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'

describe('Update User Profile (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PATCH] /users/me', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        bio: 'My updated bio.',
        avatarUrl: 'https://example.com/avatar.jpg',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        id: user.id.toString(),
        bio: 'My updated bio.',
        avatarUrl: 'https://example.com/avatar.jpg',
      }),
    })
  })

  test('[PATCH] /users/me — should be able to update only bio', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ bio: 'Just a bio.' })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        id: user.id.toString(),
        bio: 'Just a bio.',
      }),
    })
  })

  test('[PATCH] /users/me — should not be able to update without authentication', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/me')
      .send({ bio: 'Unauthenticated.' })

    expect(response.statusCode).toBe(401)
  })
})
