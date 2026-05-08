import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { Redis } from 'ioredis'

const schemaId = randomUUID().replace(/-/g, '')

beforeAll(async () => {
  const databaseUrl = new URL(process.env.DATABASE_URL!)

  databaseUrl.searchParams.set('schema', `vitest_${schemaId}`)

  process.env.DATABASE_URL = databaseUrl.toString()

  execSync('npx prisma db push --skip-generate', {
    env: process.env,
    stdio: 'inherit',
  })

  const redis = new Redis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? '6379'),
    password: process.env.REDIS_PASSWORD,
  })

  await redis.flushall()
  await redis.quit()
})

afterAll(async () => {
  const { PrismaClient } = await import('@prisma/client')

  const prisma = new PrismaClient()

  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "vitest_${schemaId}" CASCADE`,
  )

  await prisma.$disconnect()
})
