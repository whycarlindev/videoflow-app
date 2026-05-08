import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Register User (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /users', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password123',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        email: 'john@example.com',
        username: 'johndoe',
      }),
    })
  })

  test('[POST] /users — should not be able to register with a duplicate email', async () => {
    await request(app.getHttpServer()).post('/users').send({
      email: 'duplicate@example.com',
      username: 'firstuser',
      password: 'password123',
    })

    const response = await request(app.getHttpServer()).post('/users').send({
      email: 'duplicate@example.com',
      username: 'seconduser',
      password: 'password123',
    })

    expect(response.statusCode).toBe(409)
  })

  test('[POST] /users — should not be able to register with a duplicate username', async () => {
    await request(app.getHttpServer()).post('/users').send({
      email: 'first@example.com',
      username: 'sharedname',
      password: 'password123',
    })

    const response = await request(app.getHttpServer()).post('/users').send({
      email: 'second@example.com',
      username: 'sharedname',
      password: 'password123',
    })

    expect(response.statusCode).toBe(409)
  })
})
