// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    products: {
      id: string
      name: string
      description: string
      quantity: number
    }
  }
}
