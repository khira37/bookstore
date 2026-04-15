export default {
  name: 'order',
  type: 'document',
  title: 'Orders',
  fields: [
    { name: 'customerName', type: 'string', title: 'Customer Name' },
    { name: 'email', type: 'string', title: 'Email Address' },
    { name: 'location', type: 'string', title: 'Shipping Address' },
    { name: 'paymentMethod', type: 'string', title: 'Payment Method' },
    { name: 'totalPrice', type: 'number', title: 'Total Price' },
    {
      name: 'items',
      type: 'array',
      title: 'Books Ordered',
      of: [{ type: 'string' }] // Simplified list of book titles
    },
    { name: 'status', type: 'string', title: 'Order Status', initialValue: 'pending' }
  ],
  preview: {
    select: {
      title: '_id',
      subtitle: 'customerName',
    },
  },
}