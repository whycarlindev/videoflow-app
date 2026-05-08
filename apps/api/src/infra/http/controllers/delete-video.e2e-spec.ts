import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'
import { VideoFactory } from 'test/factories/video-factory'

describe('Delete Video (E2E)', () => {
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

  test('[DELETE] /videos/:videoId', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .delete(`/videos/${video.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
  })

  test('[DELETE] /videos/:videoId — should not be able to delete another user video', async () => {
    const author = await userFactory.makePrismaUser()
    const other = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: other.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(author.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .delete(`/videos/${video.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })

  test('[DELETE] /videos/:videoId — should not be able to delete a non-existent video', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .delete('/videos/non-existent-video-id')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  test('[DELETE] /videos/:videoId — should not be able to delete without authentication', async () => {
    const user = await userFactory.makePrismaUser()

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer()).delete(
      `/videos/${video.id.toString()}`,
    )

    expect(response.statusCode).toBe(401)
  })
})
