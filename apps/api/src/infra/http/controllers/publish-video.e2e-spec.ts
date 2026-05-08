import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'
import { VideoFactory } from 'test/factories/video-factory'

describe('Publish Video (E2E)', () => {
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

  test('[PATCH] /videos/:videoId/publish', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .patch(`/videos/${video.id.toString()}/publish`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      video: expect.objectContaining({
        id: video.id.toString(),
        authorId: user.id.toString(),
        status: 'published',
      }),
    })
  })

  test('[PATCH] /videos/:videoId/publish — should not be able to publish another user video', async () => {
    const author = await userFactory.makePrismaUser()
    const other = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: other.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(author.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .patch(`/videos/${video.id.toString()}/publish`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })

  test('[PATCH] /videos/:videoId/publish — should not be able to publish a non-existent video', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .patch('/videos/non-existent-video-id/publish')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  test('[PATCH] /videos/:videoId/publish — should not be able to publish without authentication', async () => {
    const user = await userFactory.makePrismaUser()

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer()).patch(
      `/videos/${video.id.toString()}/publish`,
    )

    expect(response.statusCode).toBe(401)
  })
})
