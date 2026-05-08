import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Authenticate User (E2E)', () => {
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

  test('[POST] /sessions', async () => {
    await request(app.getHttpServer()).post('/users').send({
      email: 'auth-test@example.com',
      username: 'authuser',
      password: 'password123',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'auth-test@example.com',
      password: 'password123',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    })
  })

  test('[POST] /sessions — should not be able to authenticate with wrong password', async () => {
    await request(app.getHttpServer()).post('/users').send({
      email: 'wrongpass@example.com',
      username: 'wrongpassuser',
      password: 'correct-password',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'wrongpass@example.com',
      password: 'wrong-password',
    })

    expect(response.statusCode).toBe(401)
  })

  test('[POST] /sessions — should not be able to authenticate with non-existent email', async () => {
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'nonexistent@example.com',
      password: 'password123',
    })

    expect(response.statusCode).toBe(401)
  })
})
