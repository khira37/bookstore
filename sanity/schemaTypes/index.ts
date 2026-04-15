import { type SchemaTypeDefinition } from 'sanity'

import book from './book'
import order from './order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [book, order],
}


