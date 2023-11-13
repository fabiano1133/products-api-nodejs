import { env } from './env'
import { app } from './app'

app
  .listen({
    port: env.APP_HTTP_PORT,
    host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log(`WEB APPLICATION IS RUNNING`)
  })
