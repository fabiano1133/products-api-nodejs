import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  APP_HTTP_PORT: z.coerce.number().default(8181),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error(`Invalid Variable: ${JSON.stringify(_env.error.format())}`)

  throw new Error('Invalid environment variables')
}

export const env = _env.data
