import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'

describe('Follow User (E2E)', () => {
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

  test('[POST] /users/:channelId/follow', async () => {
    const subscriber = await userFactory.makePrismaUser()
    const channel = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: subscriber.id.toString() })

    const response = await request(app.getHttpServer())
      .post(`/users/${channel.id.toString()}/follow`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
  })

  test('[POST] /users/:channelId/follow — should not be able to follow the same user twice', async () => {
    const subscriber = await userFactory.makePrismaUser()
    const channel = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: subscriber.id.toString() })

    await request(app.getHttpServer())
      .post(`/users/${channel.id.toString()}/follow`)
      .set('Authorization', `Bearer ${accessToken}`)

    const response = await request(app.getHttpServer())
      .post(`/users/${channel.id.toString()}/follow`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(409)
  })

  test('[POST] /users/:channelId/follow — should not be able to follow a non-existent user', async () => {
    const subscriber = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: subscriber.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/users/non-existent-user-id/follow')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  test('[POST] /users/:channelId/follow — should not be able to follow without authentication', async () => {
    const channel = await userFactory.makePrismaUser()

    const response = await request(app.getHttpServer()).post(
      `/users/${channel.id.toString()}/follow`,
    )

    expect(response.statusCode).toBe(401)
  })
})
