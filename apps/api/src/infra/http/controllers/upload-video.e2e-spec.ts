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

    const response = await request(app.getHttpServer())
      .post('/videos')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('title', 'My First Video')
      .field('description', 'A video uploaded in an E2E test.')
      .field('tags', JSON.stringify(['test', 'e2e']))
      .attach('file', Buffer.from('fake-video-content'), {
        filename: 'video.mp4',
        contentType: 'video/mp4',
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
      .field('title', 'Unauthorized Video')
      .field('description', 'This should fail.')
      .attach('file', Buffer.from('content'), {
        filename: 'video.mp4',
        contentType: 'video/mp4',
      })

    expect(response.statusCode).toBe(401)
  })

  test('[POST] /videos — should not be able to upload without a file', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/videos')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('title', 'Missing File')
      .field('description', 'No file attached.')

    expect(response.statusCode).toBe(400)
  })

  test('[POST] /videos — should not be able to upload unsupported file type', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwtService.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/videos')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('title', 'Wrong Type')
      .field('description', 'PDF is not a video.')
      .attach('file', Buffer.from('%PDF-fake'), {
        filename: 'document.pdf',
        contentType: 'application/pdf',
      })

    expect(response.statusCode).toBe(415)
  })
})
