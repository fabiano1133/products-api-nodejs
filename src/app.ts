import { fastify } from 'fastify'
import { ProductsRoutes } from './routes/products'

export const app = fastify()

app.register(ProductsRoutes, {
  prefix: '/products',
})
