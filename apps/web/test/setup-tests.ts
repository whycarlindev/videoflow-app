import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { config } from 'dotenv'
import { server } from './mocks/node'

config({
  path: '.env.test',
  override: true,
  quiet: true,
})

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})
