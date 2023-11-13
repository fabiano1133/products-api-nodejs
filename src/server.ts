import { env } from './env'
import { app } from './app'

app
  .listen({
    port: env.APP_HTTP_PORT,
  })
  .then(() => {
    console.log(`WEB APPLICATION IS RUNNING`)
  })
