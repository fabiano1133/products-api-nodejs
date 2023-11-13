import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'

export async function ProductsRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const createProductSchema = z.object({
      name: z.string(),
      description: z.string(),
      quantity: z.number(),
    })

    const { name, description, quantity } = createProductSchema.parse(req.body)

    await knex('products')
      .insert({
        id: crypto.randomUUID(),
        name,
        description,
        quantity,
      })
      .returning('*')
    return res.status(201).send()
  })

  app.get('/', async () => {
    const products = await knex('products').select('*')
    return { products, total: products.length }
  })

  app.get('/summary', async () => {
    const productsSummary = await knex('products').select('name')

    return { productsSummary }
  })

  app.get('/:id', async (req) => {
    const selectProductSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = selectProductSchema.parse(req.params)

    const product = await knex('products').where({ id }).first()

    return { product }
  })
}
