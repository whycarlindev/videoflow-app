import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'

describe('Create Playlist (E2E)', () => {
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

  test('[POST] /playlists', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/playlists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'My Awesome Playlist',
        description: 'A playlist created in an E2E test.',
        isPublic: true,
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      playlist: expect.objectContaining({
        title: 'My Awesome Playlist',
        description: 'A playlist created in an E2E test.',
        authorId: user.id.toString(),
        isPublic: true,
        videos: [],
      }),
    })
  })

  test('[POST] /playlists — should be able to create a private playlist', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/playlists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Private Playlist',
        isPublic: false,
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      playlist: expect.objectContaining({
        title: 'Private Playlist',
        authorId: user.id.toString(),
        isPublic: false,
      }),
    })
  })

  test('[POST] /playlists — should not be able to create a playlist without authentication', async () => {
    const response = await request(app.getHttpServer())
      .post('/playlists')
      .send({
        title: 'Unauthenticated Playlist',
      })

    expect(response.statusCode).toBe(401)
  })
})
