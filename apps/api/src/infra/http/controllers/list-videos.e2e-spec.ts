import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'
import { VideoFactory } from 'test/factories/video-factory'

describe('List Videos (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let videoFactory: VideoFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, VideoFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    videoFactory = moduleRef.get(VideoFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /videos', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
      title: 'Listed Video',
    })

    const response = await request(app.getHttpServer())
      .get('/videos')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('videos')
    expect(Array.isArray(response.body.videos)).toBe(true)
  })

  test('[GET] /videos — should support pagination', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/videos?page=1&perPage=5')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('videos')
    expect(Array.isArray(response.body.videos)).toBe(true)
  })

  test('[GET] /videos — should not be able to list without authentication', async () => {
    const response = await request(app.getHttpServer()).get('/videos')

    expect(response.statusCode).toBe(401)
  })
})
