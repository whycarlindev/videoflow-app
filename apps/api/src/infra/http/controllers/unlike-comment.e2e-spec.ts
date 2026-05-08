import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'
import { VideoFactory } from 'test/factories/video-factory'
import { CommentFactory } from 'test/factories/comment-factory'

describe('Unlike Comment (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let videoFactory: VideoFactory
  let commentFactory: CommentFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, VideoFactory, CommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    videoFactory = moduleRef.get(VideoFactory)
    commentFactory = moduleRef.get(CommentFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[DELETE] /comments/:commentId/like', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const comment = await commentFactory.makePrismaComment({
      videoId: new UniqueEntityId(video.id.toString()),
      authorId: new UniqueEntityId(user.id.toString()),
    })

    await request(app.getHttpServer())
      .post(`/comments/${comment.id.toString()}/like`)
      .set('Authorization', `Bearer ${accessToken}`)

    const response = await request(app.getHttpServer())
      .delete(`/comments/${comment.id.toString()}/like`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
  })

  test('[DELETE] /comments/:commentId/like — should not be able to unlike a non-existent comment', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .delete('/comments/non-existent-comment-id/like')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  test('[DELETE] /comments/:commentId/like — should not be able to unlike without authentication', async () => {
    const user = await userFactory.makePrismaUser()

    const video = await videoFactory.makePrismaVideo({
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const comment = await commentFactory.makePrismaComment({
      videoId: new UniqueEntityId(video.id.toString()),
      authorId: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.getHttpServer()).delete(
      `/comments/${comment.id.toString()}/like`,
    )

    expect(response.statusCode).toBe(401)
  })
})
