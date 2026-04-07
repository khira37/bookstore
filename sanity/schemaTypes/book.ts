import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'cover',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
    })
  ]
})