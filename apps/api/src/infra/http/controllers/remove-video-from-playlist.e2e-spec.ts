import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'
import { VideoFactory } from 'test/factories/video-factory'
import { PlaylistFactory } from 'test/factories/playlist-factory'

describe('Remove Video From Playlist (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let videoFactory: VideoFactory
  let playlistFactory: PlaylistFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, VideoFactory, PlaylistFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    videoFactory = moduleRef.get(VideoFactory)
    playlistFactory = moduleRef.get(PlaylistFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[DELETE] /playlists/:playlistId/videos/:videoId', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const playlist = await playlistFactory.makePrismaPlaylist({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    await request(app.getHttpServer())
      .post(`/playlists/${playlist.id.toString()}/videos`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ videoId: video.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/playlists/${playlist.id.toString()}/videos/${video.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
  })

  test('[DELETE] /playlists/:playlistId/videos/:videoId — should not be able to remove from another user playlist', async () => {
    const owner = await userFactory.makePrismaUser()
    const other = await userFactory.makePrismaUser()

    const ownerToken = jwtService.sign({ sub: owner.id.toString() })
    const otherToken = jwtService.sign({ sub: other.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(owner.id.toString()),
    })

    const playlist = await playlistFactory.makePrismaPlaylist({
      authorId: new UniqueEntityId(owner.id.toString()),
    })

    await request(app.getHttpServer())
      .post(`/playlists/${playlist.id.toString()}/videos`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ videoId: video.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/playlists/${playlist.id.toString()}/videos/${video.id.toString()}`)
      .set('Authorization', `Bearer ${otherToken}`)

    expect(response.statusCode).toBe(403)
  })

  test('[DELETE] /playlists/:playlistId/videos/:videoId — should not be able to remove from a non-existent playlist', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .delete(`/playlists/non-existent-playlist-id/videos/${video.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  test('[DELETE] /playlists/:playlistId/videos/:videoId — should not be able to remove without authentication', async () => {
    const user = await userFactory.makePrismaUser()

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const playlist = await playlistFactory.makePrismaPlaylist({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer()).delete(
      `/playlists/${playlist.id.toString()}/videos/${video.id.toString()}`,
    )

    expect(response.statusCode).toBe(401)
  })
})
