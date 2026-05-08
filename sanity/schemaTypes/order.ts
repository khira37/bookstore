export default {
  name: "order",
  type: "document",
  title: "Orders",
  fields: [
    { name: "customerName", type: "string", title: "Customer Name" },
    { name: "email", type: "string", title: "Email Address" },
    { name: "location", type: "string", title: "Shipping Address" },
    { name: "paymentMethod", type: "string", title: "Payment Method" },
    { name: "totalPrice", type: "number", title: "Total Price" },
    {
      name: "items",
      type: "array",
      title: "Books Ordered",
      of: [{ type: "string" }], // Simplified list of book titles
    },
    {
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "dropdown", // Can also be 'radio'
      },
      initialValue: "pending", // Sets the default status for new orders
    },
  ],
  preview: {
    select: {
      title: "_id",
      subtitle: "customerName",
    },
  },
};
