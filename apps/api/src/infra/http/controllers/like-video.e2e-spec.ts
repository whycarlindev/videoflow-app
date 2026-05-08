import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'
import { VideoFactory } from 'test/factories/video-factory'

describe('Like Video (E2E)', () => {
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

  test('[POST] /videos/:videoId/like', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .post(`/videos/${video.id.toString()}/like`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
  })

  test('[POST] /videos/:videoId/like — should not be able to like the same video twice', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    await request(app.getHttpServer())
      .post(`/videos/${video.id.toString()}/like`)
      .set('Authorization', `Bearer ${accessToken}`)

    const response = await request(app.getHttpServer())
      .post(`/videos/${video.id.toString()}/like`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(409)
  })

  test('[POST] /videos/:videoId/like — should not be able to like a non-existent video', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/videos/non-existent-video-id/like')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  test('[POST] /videos/:videoId/like — should not be able to like without authentication', async () => {
    const user = await userFactory.makePrismaUser()

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer()).post(
      `/videos/${video.id.toString()}/like`,
    )

    expect(response.statusCode).toBe(401)
  })
})
