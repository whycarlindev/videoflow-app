import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'
import { VideoFactory } from 'test/factories/video-factory'
import { WatchEntryFactory } from 'test/factories/watch-entry-factory'

describe('Get User Watch History (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let videoFactory: VideoFactory
  let watchEntryFactory: WatchEntryFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, VideoFactory, WatchEntryFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    videoFactory = moduleRef.get(VideoFactory)
    watchEntryFactory = moduleRef.get(WatchEntryFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /watch-history', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    await watchEntryFactory.makePrismaWatchEntry({
      userId: new UniqueEntityId(user.id.toString()),
      videoId: new UniqueEntityId(video.id.toString()),
      progressPercentage: 75,
    })

    const response = await request(app.getHttpServer())
      .get('/watch-history')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      watchHistory: expect.arrayContaining([
        expect.objectContaining({
          userId: user.id.toString(),
          videoId: video.id.toString(),
          progressPercentage: 75,
        }),
      ]),
    })
  })

  test('[GET] /watch-history — should return empty list when user has no history', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/watch-history')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ watchHistory: [] })
  })

  test('[GET] /watch-history — should not be able to get history without authentication', async () => {
    const response = await request(app.getHttpServer()).get('/watch-history')

    expect(response.statusCode).toBe(401)
  })
})
