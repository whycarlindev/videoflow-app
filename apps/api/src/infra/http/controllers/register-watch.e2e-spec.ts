import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'
import { VideoFactory } from 'test/factories/video-factory'

describe('Register Watch (E2E)', () => {
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

  test('[POST] /watch-history', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .post('/watch-history')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        videoId: video.id.toString(),
        progressPercentage: 60,
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      watchEntry: expect.objectContaining({
        userId: user.id.toString(),
        videoId: video.id.toString(),
        progressPercentage: 60,
      }),
    })
  })

  test('[POST] /watch-history — should not be able to register a watch for a non-existent video', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/watch-history')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        videoId: 'non-existent-video-id',
        progressPercentage: 50,
      })

    expect(response.statusCode).toBe(404)
  })

  test('[POST] /watch-history — should not be able to register a watch without authentication', async () => {
    const user = await userFactory.makePrismaUser()

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .post('/watch-history')
      .send({
        videoId: video.id.toString(),
        progressPercentage: 50,
      })

    expect(response.statusCode).toBe(401)
  })
})
