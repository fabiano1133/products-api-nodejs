import { describe, beforeAll, afterAll, expect, it, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../../src/app'
import request from 'supertest'

describe('Products', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('Should be able create an product', async () => {
    const product = {
      name: 'Product test name',
      description: 'Product test description',
      quantity: 1,
    }
    await request(app.server).post('/products').send(product).expect(201)
  })

  it('Should be able to return all products', async () => {
    const response = await request(app.server).get('/products')

    expect(response.statusCode).toEqual(200)
  })

  it('Should be able to return a product with id informed', async () => {
    const product = {
      name: 'Product test name',
      description: 'Product test description',
      quantity: 1,
    }
    await request(app.server).post('/products').send(product)

    const products = await request(app.server).get('/products')

    const productId = products.body.products[0].id

    const response = await request(app.server).get(`/products/${productId}`)

    expect(response.statusCode).toEqual(200)
  })

  it.only('Should be able to return a summary list', async () => {
    const productA = {
      name: 'Product test name A',
      description: 'Product test description A',
      quantity: 1,
    }
    await request(app.server).post('/products').send(productA)

    const productB = {
      name: 'Product test name B',
      description: 'Product test description B',
      quantity: 2,
    }
    await request(app.server).post('/products').send(productB)

    const response = await request(app.server).get(`/products/summary`)

    expect(response.statusCode).toEqual(200)
  })
})
