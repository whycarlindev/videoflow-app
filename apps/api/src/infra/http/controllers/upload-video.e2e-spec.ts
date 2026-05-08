import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { VideoUploader } from '@/domain/video/application/ports/video-uploader'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/user-factory'

describe('Upload Video (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    })
      .overrideProvider(VideoUploader)
      .useValue({
        upload: vi
          .fn()
          .mockResolvedValue({ url: 'https://storage.test/video.mp4' }),
      })
      .compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /videos', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const fileContent = Buffer.from('fake-video-content').toString('base64')

    const response = await request(app.getHttpServer())
      .post('/videos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'My First Video',
        description: 'A video uploaded in an E2E test.',
        fileName: 'video.mp4',
        fileType: 'video/mp4',
        fileBase64: fileContent,
        tags: ['test', 'e2e'],
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      video: expect.objectContaining({
        title: 'My First Video',
        description: 'A video uploaded in an E2E test.',
        authorId: user.id.toString(),
        tags: expect.arrayContaining(['test', 'e2e']),
      }),
    })
  })

  test('[POST] /videos — should not be able to upload without authentication', async () => {
    const response = await request(app.getHttpServer())
      .post('/videos')
      .send({
        title: 'Unauthorized Video',
        description: 'This should fail.',
        fileName: 'video.mp4',
        fileType: 'video/mp4',
        fileBase64: Buffer.from('content').toString('base64'),
      })

    expect(response.statusCode).toBe(401)
  })
})
