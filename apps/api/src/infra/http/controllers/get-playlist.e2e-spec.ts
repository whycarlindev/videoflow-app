import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'
import { PlaylistFactory } from 'test/factories/playlist-factory'

describe('Get Playlist (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let playlistFactory: PlaylistFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PlaylistFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    playlistFactory = moduleRef.get(PlaylistFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /playlists/:playlistId', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const playlist = await playlistFactory.makePrismaPlaylist({
      authorId: new UniqueEntityId(user.id.toString()),
      title: 'My E2E Playlist',
    })

    const response = await request(app.getHttpServer())
      .get(`/playlists/${playlist.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      playlist: expect.objectContaining({
        id: playlist.id.toString(),
        title: 'My E2E Playlist',
        authorId: user.id.toString(),
      }),
    })
  })

  test('[GET] /playlists/:playlistId — should not be able to get a non-existent playlist', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/playlists/non-existent-playlist-id')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  test('[GET] /playlists/:playlistId — should not be able to get without authentication', async () => {
    const user = await userFactory.makePrismaUser()

    const playlist = await playlistFactory.makePrismaPlaylist({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer()).get(
      `/playlists/${playlist.id.toString()}`,
    )

    expect(response.statusCode).toBe(401)
  })
})
