import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'
import { VideoFactory } from 'test/factories/video-factory'

describe('Add Comment (E2E)', () => {
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

  test('[POST] /videos/:videoId/comments', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
      title: 'Add Comment Success Video',
    })

    const response = await request(app.getHttpServer())
      .post(`/videos/${video.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'This is a great video!' })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      comment: expect.objectContaining({
        videoId: video.id.toString(),
        authorId: user.id.toString(),
        content: 'This is a great video!',
      }),
    })
  })

  test('[POST] /videos/:videoId/comments — should not be able to comment on a non-existent video', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/videos/non-existent-video-id/comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'This should fail.' })

    expect(response.statusCode).toBe(404)
  })

  test('[POST] /videos/:videoId/comments — should not be able to comment without authentication', async () => {
    const user = await userFactory.makePrismaUser()
    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
      title: 'Add Comment Unauth Video',
    })

    const response = await request(app.getHttpServer())
      .post(`/videos/${video.id.toString()}/comments`)
      .send({ content: 'Unauthenticated comment.' })

    expect(response.statusCode).toBe(401)
  })
})
