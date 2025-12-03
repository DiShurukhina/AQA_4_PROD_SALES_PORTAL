/* eslint-env browser */
/* global window, SwaggerUIBundle, SwaggerUIStandalonePreset */

window.onload = function () {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
    swaggerDoc: {
      openapi: "3.0.0",
      info: {
        title: "Sales Portal API",
        version: "1.0.0",
        description: "AQA course project API",
      },
      servers: [
        {
          url: "https://aqa-course-project.app/",
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          AuthLogin: {
            type: "object",
            required: ["username", "password"],
            properties: {
              username: {
                type: "string",
                description: "The user's username",
              },
              password: {
                type: "string",
                description: "The user's password",
              },
            },
            example: {
              username: "user123@example.com",
              password: "Password123",
            },
          },
          Customer: {
            type: "object",
            required: [
              "email",
              "name",
              "country",
              "city",
              "street",
              "house",
              "flat",
              "phone",
              "createdOn",
            ],
            properties: {
              _id: {
                type: "string",
                description: "The auto-generated id of the customer",
              },
              email: {
                type: "string",
                description: "The customer's email address",
              },
              name: {
                type: "string",
                description: "The customer's name",
              },
              country: {
                type: "string",
                enum: [
                  "USA",
                  "Canada",
                  "Belarus",
                  "Ukraine",
                  "Germany",
                  "France",
                  "Great Britain",
                  "Russia",
                ],
                description: "The customer's country",
              },
              city: {
                type: "string",
                description: "The customer's city",
              },
              street: {
                type: "string",
                description: "The customer's street",
              },
              house: {
                type: "number",
                description: "The customer's house number",
              },
              flat: {
                type: "number",
                description: "The customer's flat number",
              },
              phone: {
                type: "string",
                description: "The customer's phone number",
              },
              createdOn: {
                type: "string",
                format: "date-time",
                description: "The date the customer was created",
              },
              notes: {
                type: "string",
                description: "Additional notes about the customer",
              },
            },
            example: {
              _id: "6396593e54206d313b2a50b7",
              email: "customer1@example.com",
              name: "John Doe",
              country: "USA",
              city: "New York",
              street: "5th Avenue",
              house: 123,
              flat: 45,
              phone: "+155512345678",
              createdOn: "2024-09-28T14:00:00Z",
              notes: "Frequent customer",
            },
          },
          CustomerWithoutId: {
            type: "object",
            required: [
              "email",
              "name",
              "country",
              "city",
              "street",
              "house",
              "flat",
              "phone",
            ],
            properties: {
              email: {
                type: "string",
                description: "The customer's email address",
              },
              name: {
                type: "string",
                description: "The customer's name",
              },
              country: {
                type: "string",
                enum: [
                  "USA",
                  "Canada",
                  "Belarus",
                  "Ukraine",
                  "Germany",
                  "France",
                  "Great Britain",
                  "Russia",
                ],
                description: "The customer's country",
              },
              city: {
                type: "string",
                description: "The customer's city",
              },
              street: {
                type: "string",
                description: "The customer's street",
              },
              house: {
                type: "number",
                description: "The customer's house number",
              },
              flat: {
                type: "number",
                description: "The customer's flat number",
              },
              phone: {
                type: "string",
                description: "The customer's phone number",
              },
              notes: {
                type: "string",
                description: "Additional notes about the customer",
              },
            },
            example: {
              email: "customer1@example.com",
              name: "John Doe",
              country: "USA",
              city: "New York",
              street: "5th Avenue",
              house: 123,
              flat: 45,
              phone: "+155512345678",
              notes: "Frequent customer",
            },
          },
          Metric: {
            type: "object",
            properties: {
              orders: {
                type: "object",
                properties: {
                  totalRevenue: {
                    type: "number",
                    description: "Total revenue for the current year",
                  },
                  totalOrders: {
                    type: "number",
                    description: "Total number of orders for the current year",
                  },
                  averageOrderValue: {
                    type: "number",
                    description: "Average value of an order",
                  },
                  totalCanceledOrders: {
                    type: "number",
                    description:
                      "Total number of canceled orders for the current year",
                  },
                  recentOrders: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Order",
                    },
                    description: "Recently created orders",
                  },
                  ordersCountPerDay: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        date: {
                          type: "object",
                          properties: {
                            year: {
                              type: "number",
                            },
                            month: {
                              type: "number",
                            },
                            day: {
                              type: "number",
                            },
                          },
                        },
                        count: {
                          type: "number",
                        },
                      },
                    },
                    description: "Daily order count for the current month",
                  },
                },
              },
              customers: {
                type: "object",
                properties: {
                  totalNewCustomers: {
                    type: "number",
                    description: "Total new customers for the current year",
                  },
                  topCustomers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        customerName: {
                          type: "string",
                        },
                        customerEmail: {
                          type: "string",
                        },
                        totalSpent: {
                          type: "number",
                        },
                        ordersCount: {
                          type: "number",
                        },
                      },
                    },
                    description: "Top 3 customers by total spent",
                  },
                  customerGrowth: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        date: {
                          type: "object",
                          properties: {
                            year: {
                              type: "number",
                            },
                            month: {
                              type: "number",
                            },
                            day: {
                              type: "number",
                            },
                          },
                        },
                        count: {
                          type: "number",
                        },
                      },
                    },
                    description: "Customer registrations over the last 15 days",
                  },
                },
              },
              products: {
                type: "object",
                properties: {
                  topProducts: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        sales: {
                          type: "number",
                        },
                      },
                    },
                    description: "Top 5 best-selling products",
                  },
                },
              },
            },
          },
          Notification: {
            type: "object",
            required: ["userId", "type", "orderId", "message", "read"],
            properties: {
              _id: {
                type: "string",
                description: "The notification ID",
              },
              userId: {
                type: "string",
                description: "The user this notification belongs to",
              },
              type: {
                type: "string",
                description:
                  "The type of notification (e.g., statusChanged, assigned, etc.)",
              },
              orderId: {
                type: "string",
                description: "The order related to the notification",
              },
              message: {
                type: "string",
                description: "The notification text",
              },
              read: {
                type: "boolean",
                description: "Read/unread status",
              },
              createdAt: {
                type: "string",
                format: "date-time",
                description: "When notification was created",
              },
              expiresAt: {
                type: "string",
                format: "date-time",
                description: "When notification expires (for cleanup)",
              },
            },
            example: {
              _id: "66685e03a49be8eea8b3b111",
              userId: "6650b914db6d1d4d12c6c915",
              type: "statusChanged",
              orderId: "6628e650db61bb3e9ed9ef19",
              message: "Order #12345 status changed to 'In Process'",
              read: false,
              createdAt: "2024-05-27T10:27:46.858Z",
              expiresAt: "2024-05-30T10:27:46.858Z",
            },
          },
          Order: {
            type: "object",
            required: [
              "status",
              "customer",
              "products",
              "total_price",
              "createdOn",
            ],
            properties: {
              _id: {
                type: "string",
                description: "The auto-generated id of the order",
              },
              status: {
                type: "string",
                enum: [
                  "Draft",
                  "In Process",
                  "Partially Received",
                  "Received",
                  "Canceled",
                ],
                description: "The current status of the order",
              },
              customer: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                  country: {
                    type: "string",
                    enum: [
                      "USA",
                      "Canada",
                      "Belarus",
                      "Ukraine",
                      "Germany",
                      "France",
                      "Great Britain",
                      "Russia",
                    ],
                  },
                  city: {
                    type: "string",
                  },
                  street: {
                    type: "string",
                  },
                  house: {
                    type: "number",
                  },
                  flat: {
                    type: "number",
                  },
                  phone: {
                    type: "string",
                  },
                  createdOn: {
                    type: "string",
                    format: "date-time",
                  },
                  notes: {
                    type: "string",
                  },
                },
                description: "Customer details for the order",
              },
              products: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ProductInOrder",
                },
                description: "List of products in the order",
              },
              total_price: {
                type: "number",
                description: "Total price of the order",
              },
              createdOn: {
                type: "string",
                format: "date-time",
                description: "Date the order was created",
              },
              delivery: {
                $ref: "#/components/schemas/Delivery",
                description: "Delivery details of the order",
              },
              comments: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Comment",
                },
                description: "Comments related to the order",
              },
              history: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/OrderHistory",
                },
                description: "History of the order",
              },
            },
          },
          OrderWithoutDelivery: {
            type: "object",
            required: [
              "status",
              "customer",
              "products",
              "total_price",
              "createdOn",
            ],
            properties: {
              _id: {
                type: "string",
                description: "The auto-generated id of the order",
              },
              status: {
                type: "string",
                enum: [
                  "Draft",
                  "In Process",
                  "Partially Received",
                  "Received",
                  "Canceled",
                ],
                description: "The current status of the order",
              },
              customer: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                  },
                  email: {
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                  country: {
                    type: "string",
                    enum: [
                      "USA",
                      "Canada",
                      "Belarus",
                      "Ukraine",
                      "Germany",
                      "France",
                      "Great Britain",
                      "Russia",
                    ],
                  },
                  city: {
                    type: "string",
                  },
                  street: {
                    type: "string",
                  },
                  house: {
                    type: "number",
                  },
                  flat: {
                    type: "number",
                  },
                  phone: {
                    type: "string",
                  },
                  createdOn: {
                    type: "string",
                    format: "date-time",
                  },
                  notes: {
                    type: "string",
                  },
                },
              },
              products: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ProductInOrder",
                },
              },
              total_price: {
                type: "number",
              },
              createdOn: {
                type: "string",
                format: "date-time",
              },
              delivery: {
                type: "object",
                nullable: true,
                description: "Delivery details, will be null for Draft status",
                example: null,
              },
              comments: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Comment",
                },
              },
              history: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/OrderHistory",
                },
              },
            },
            example: {
              status: "Draft",
              customer: {
                _id: "66f9d2695ea81af0e61adb59",
                email: "Estefania_Emard@gmail.com",
                name: "Ira Swaniawski IV",
                country: "Great Britain",
                city: "Fort Jimmyton",
                street: "Howell Crest",
                house: 169,
                flat: 6734,
                phone: "+449807453699",
                createdOn: "2024-09-29T22:19:00.000Z",
                notes: "Notes here",
              },
              products: [
                {
                  _id: "66eb4139fd0a2ec681e705aa",
                  name: "Gloves48933",
                  amount: 2,
                  price: 100,
                  manufacturer: "Microsoft",
                  notes: "Test notes",
                  received: false,
                },
              ],
              total_price: 300,
              createdOn: "2024-09-30T19:42:00.000Z",
              delivery: null,
              comments: [],
              history: [
                {
                  status: "Draft",
                  customer: "66f9d2695ea81af0e61adb59",
                  products: [
                    {
                      _id: "66eb3d8ffd0a2ec681e70581",
                      name: "Ball1",
                      amount: 22,
                      price: 101,
                      manufacturer: "Tesla",
                      notes: "Test notes",
                      received: false,
                    },
                  ],
                  total_price: 300,
                  delivery: null,
                  changedOn: "2024-09-30T19:42:00.000Z",
                  action: "Order created",
                },
              ],
              _id: "66faff1a5ea81af0e61addfa",
            },
          },
          ProductInOrder: {
            type: "object",
            properties: {
              _id: {
                type: "string",
              },
              name: {
                type: "string",
              },
              amount: {
                type: "number",
              },
              price: {
                type: "number",
              },
              manufacturer: {
                type: "string",
                enum: [
                  "Apple",
                  "Samsung",
                  "Google",
                  "Microsoft",
                  "Sony",
                  "Xiaomi",
                  "Amazon",
                  "Tesla",
                ],
              },
              received: {
                type: "boolean",
                description: "Whether the product has been received or not",
              },
            },
          },
          Delivery: {
            type: "object",
            properties: {
              finalDate: {
                type: "string",
                format: "date",
                description: "The final delivery date",
              },
              condition: {
                type: "string",
                enum: ["Delivery", "Pickup"],
                description:
                  "The delivery condition (e.g., Delivery or Pickup)",
              },
              address: {
                type: "object",
                properties: {
                  country: {
                    type: "string",
                    enum: [
                      "USA",
                      "Canada",
                      "Belarus",
                      "Ukraine",
                      "Germany",
                      "France",
                      "Great Britain",
                      "Russia",
                    ],
                    description: "The country of the address",
                  },
                  city: {
                    type: "string",
                    description: "The city of the address",
                  },
                  street: {
                    type: "string",
                    description: "The street of the address",
                  },
                  house: {
                    type: "integer",
                    description: "The house number",
                  },
                  flat: {
                    type: "integer",
                    description: "The flat number",
                  },
                },
                required: ["country", "city", "street", "house", "flat"],
              },
            },
            required: ["finalDate", "condition", "address"],
            example: {
              finalDate: "2023-04-30",
              condition: "Pickup",
              address: {
                country: "USA",
                city: "New York",
                street: "5th Avenue",
                house: 1,
                flat: 101,
              },
            },
          },
          Comment: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                description: "The auto-generated ID of the comment",
              },
              text: {
                type: "string",
                description: "Comment text",
              },
              createdOn: {
                type: "string",
                format: "date-time",
                description: "Date and time the comment was created",
              },
            },
            example: {
              _id: "645189c01b1eccc04f9aba5d",
              text: "Great service!",
              createdOn: "2023-09-29T12:05:00Z",
            },
          },
          OrderHistory: {
            type: "object",
            properties: {
              status: {
                type: "string",
              },
              customer: {
                type: "string",
              },
              products: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ProductInOrder",
                },
              },
              total_price: {
                type: "number",
              },
              action: {
                type: "string",
                enum: [
                  "Order created",
                  "Customer changed",
                  "Requested products changed",
                  "Order processing started",
                  "Delivery Scheduled",
                  "Delivery Edited",
                  "Received",
                  "Received All",
                  "Order canceled",
                ],
              },
              changedOn: {
                type: "string",
                format: "date-time",
              },
            },
          },
          CreateOrderPayload: {
            type: "object",
            required: ["customer", "products"],
            properties: {
              customer: {
                type: "string",
                description: "The ID of the customer placing the order",
                example: "64496fed9032279ec58cd8cd",
              },
              products: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Array of product IDs in the order",
                example: [
                  "6449700d9032279ec58cd8de",
                  "6449700d9032279ec58cd8de",
                  "6449700d9032279ec58cd8de",
                  "6449700d9032279ec58cd8de",
                  "6449700d9032279ec58cd8de",
                ],
              },
            },
          },
          OrderReceive: {
            type: "object",
            required: ["products"],
            properties: {
              products: {
                type: "array",
                items: {
                  type: "string",
                },
                maxItems: 5,
                minItems: 1,
                description:
                  "List of product IDs being received, can contain up to 5 identical products",
              },
            },
            example: {
              products: [
                "6447bd766e52f1d354d2f0bf",
                "6447bd766e52f1d354d2f0bf",
                "6447bd766e52f1d354d2f0bf",
                "6447bd766e52f1d354d2f0bf",
                "6447bd766e52f1d354d2f0bf",
              ],
            },
          },
          OrderStatusUpdate: {
            type: "object",
            required: ["status"],
            properties: {
              status: {
                type: "string",
                enum: [
                  "Draft",
                  "In Process",
                  "Partially Received",
                  "Received",
                  "Canceled",
                ],
                description: "The new status of the order",
              },
            },
            example: {
              status: "In Process",
            },
          },
          Product: {
            type: "object",
            required: ["name", "amount", "price", "manufacturer"],
            properties: {
              _id: {
                type: "string",
                description: "The auto-generated id of the product",
              },
              name: {
                type: "string",
                description: "The products name",
              },
              amount: {
                type: "number",
                description: "The products amount",
              },
              price: {
                type: "number",
                description: "The products price",
              },
              manufacturer: {
                type: "string",
                enum: [
                  "Apple",
                  "Samsung",
                  "Google",
                  "Microsoft",
                  "Sony",
                  "Xiaomi",
                  "Amazon",
                  "Tesla",
                ],
                description: "The products manufactirer",
              },
              createdOn: {
                type: "string",
                format: "date-time",
                description: "The date the product was created",
              },
              notes: {
                type: "string",
                description: "The products notes",
              },
            },
            example: {
              _id: "6396593e54206d313b2a50b7",
              name: "product 1",
              amount: 1,
              price: 1,
              manufacturer: "Apple",
              createdOn: "2024-09-28T14:00:00Z",
              notes: "note 1",
            },
          },
          ProductWithoutId: {
            type: "object",
            required: ["name", "amount", "price", "manufacturer"],
            properties: {
              name: {
                type: "string",
                description: "The products name",
              },
              amount: {
                type: "number",
                description: "The products amount",
              },
              price: {
                type: "number",
                description: "The products price",
              },
              manufacturer: {
                type: "string",
                enum: [
                  "Apple",
                  "Samsung",
                  "Google",
                  "Microsoft",
                  "Sony",
                  "Xiaomi",
                  "Amazon",
                  "Tesla",
                ],
                description: "The products manufactirer",
              },
              notes: {
                type: "string",
                description: "The products notes",
              },
            },
            example: {
              name: "product 1",
              amount: 1,
              price: 1,
              manufacturer: "Apple",
              notes: "note 1",
            },
          },
        },
      },
      paths: {
        "/api/login": {
          post: {
            summary: "User login",
            tags: ["Auth"],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthLogin",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Successfully logged in",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        IsSuccess: {
                          type: "boolean",
                          description: "Operation success flag",
                        },
                        ErrorMessage: {
                          type: "string",
                          nullable: true,
                        },
                      },
                    },
                  },
                },
              },
              400: {
                description: "Incorrect credentials or login error",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        IsSuccess: {
                          type: "boolean",
                          description: "Operation success flag",
                        },
                        ErrorMessage: {
                          type: "string",
                          description: "Error message in case of failure",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/api/logout": {
          post: {
            summary: "User logout",
            tags: ["Auth"],
            security: [
              {
                BearerAuth: [],
              },
            ],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            responses: {
              200: {
                description:
                  "Successfully logged out, active session is removed",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        IsSuccess: {
                          type: "boolean",
                          description: "Operation success flag",
                        },
                        ErrorMessage: {
                          type: "string",
                          nullable: true,
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized - No valid token provided",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        IsSuccess: {
                          type: "boolean",
                          description: "Operation success flag",
                        },
                        ErrorMessage: {
                          type: "string",
                          description: "Error message in case of failure",
                        },
                      },
                    },
                  },
                },
              },
              500: {
                description: "Server error during logout",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        IsSuccess: {
                          type: "boolean",
                          description: "Operation success flag",
                        },
                        ErrorMessage: {
                          type: "string",
                          description: "Error message in case of failure",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/api/customers/{customerId}/orders": {
          get: {
            summary: "Get all orders associated with the specified customer",
            tags: ["Customers"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
              {
                in: "path",
                name: "customerId",
                required: true,
                schema: {
                  type: "string",
                },
                description:
                  "The ID of the customer whose orders you want to retrieve",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "A list of orders associated with the customer",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Order",
                      },
                    },
                  },
                },
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "No orders found for the specified customer",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/customers": {
          post: {
            summary: "Create a new customer",
            tags: ["Customers"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CustomerWithoutId",
                  },
                },
              },
            },
            responses: {
              201: {
                description: "The customer was successfully created",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Customer",
                    },
                  },
                },
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              409: {
                description: "Conflict, customer already exists",
              },
              500: {
                description: "Server error",
              },
            },
          },
          get: {
            summary:
              "Get the list of customers with optional filters and sorting",
            tags: ["Customers"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
              {
                in: "query",
                name: "search",
                schema: {
                  type: "string",
                },
                description:
                  "Search term for filtering customers by email, name, or country",
              },
              {
                in: "query",
                name: "country",
                schema: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  example: ["USA", "Canada"],
                },
                description: "Filter customers by country",
              },
              {
                in: "query",
                name: "sortField",
                schema: {
                  type: "string",
                  enum: ["email", "name", "country", "createdOn"],
                  example: "name",
                },
                description: "Field to sort by",
              },
              {
                in: "query",
                name: "sortOrder",
                schema: {
                  type: "string",
                  enum: ["asc", "desc"],
                  example: "asc",
                },
                description: "Sort order (ascending or descending)",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "The list of customers",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Customer",
                      },
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/customers/all": {
          get: {
            summary:
              "Get the list of all customers (no pagination, filters or sorting)",
            tags: ["Customers"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "The complete list of customers",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Customer",
                      },
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/customers/{id}": {
          get: {
            summary: "Get the customer by Id",
            tags: ["Customers"],
            parameters: [
              {
                in: "path",
                name: "id",
                schema: {
                  type: "string",
                },
                required: true,
                description: "The customer id",
              },
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "The customer by Id",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Customer",
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "The customer was not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
          put: {
            summary: "Update the customer by Id",
            tags: ["Customers"],
            parameters: [
              {
                in: "path",
                name: "id",
                schema: {
                  type: "string",
                },
                required: true,
                description: "The customer id",
              },
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CustomerWithoutId",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "The customer was successfully updated",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Customer",
                    },
                  },
                },
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "The customer was not found",
              },
              409: {
                description: "Conflict, unable to update the customer",
              },
              500: {
                description: "Server error",
              },
            },
          },
          delete: {
            summary: "Delete the customer by Id",
            tags: ["Customers"],
            parameters: [
              {
                in: "path",
                name: "id",
                schema: {
                  type: "string",
                },
                required: true,
                description: "The customer id",
              },
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              204: {
                description: "The customer was successfully deleted",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "The customer was not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/metrics": {
          get: {
            summary: "Get business metrics for the current year",
            tags: ["Metrics"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "Business metrics successfully retrieved",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Metric",
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/notifications": {
          get: {
            summary: "Get all notifications for the authenticated user",
            tags: ["Notifications"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "List of notifications",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        Notifications: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/Notification",
                          },
                        },
                        IsSuccess: {
                          type: "boolean",
                          example: true,
                        },
                        ErrorMessage: {
                          type: "string",
                          nullable: true,
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/notifications/{notificationId}/read": {
          patch: {
            summary: "Mark a notification as read",
            tags: ["Notifications"],
            parameters: [
              {
                in: "path",
                name: "notificationId",
                schema: {
                  type: "string",
                },
                required: true,
                description: "The ID of the notification to mark as read",
              },
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "Notification marked as read",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        Notifications: {
                          $ref: "#/components/schemas/Notification",
                        },
                        IsSuccess: {
                          type: "boolean",
                          example: true,
                        },
                        ErrorMessage: {
                          type: "string",
                          nullable: true,
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "Notification not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/notifications/mark-all-read": {
          patch: {
            summary:
              "Mark all notifications as read for the authenticated user",
            tags: ["Notifications"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "All notifications marked as read",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        Notifications: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/Notification",
                          },
                        },
                        IsSuccess: {
                          type: "boolean",
                          example: true,
                        },
                        ErrorMessage: {
                          type: "string",
                          nullable: true,
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/orders": {
          post: {
            summary: "Create a new order",
            tags: ["Orders"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreateOrderPayload",
                  },
                },
              },
            },
            responses: {
              201: {
                description: "The order was successfully created",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/OrderWithoutDelivery",
                    },
                  },
                },
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              500: {
                description: "Server error",
              },
            },
          },
          get: {
            summary: "Get the list of orders with optional filters and sorting",
            tags: ["Orders"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
              {
                in: "query",
                name: "search",
                schema: {
                  type: "string",
                },
                description:
                  "Search term for filtering orders by ID, customer name, customer email, total price, or status",
              },
              {
                in: "query",
                name: "status",
                schema: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  example: ["In Process", "Draft"],
                },
                description: "Filter orders by status",
              },
              {
                in: "query",
                name: "sortField",
                schema: {
                  type: "string",
                  enum: ["createdOn", "total_price", "status"],
                  example: "createdOn",
                },
                description: "Field to sort by",
              },
              {
                in: "query",
                name: "sortOrder",
                schema: {
                  type: "string",
                  enum: ["asc", "desc"],
                  example: "asc",
                },
                description: "Sort order (ascending or descending)",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "The list of orders",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Order",
                      },
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/orders/{id}": {
          get: {
            summary: "Get the order by Id",
            tags: ["Orders"],
            parameters: [
              {
                in: "path",
                name: "id",
                schema: {
                  type: "string",
                },
                required: true,
                description: "The order id",
              },
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "The order by Id",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "Order not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
          put: {
            summary: "Update an order",
            tags: ["Orders"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string",
                },
                description: "The ID of the order to update",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreateOrderPayload",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "The order was successfully updated",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "Order not found",
              },
              409: {
                description: "Conflict, unable to update the order",
              },
              500: {
                description: "Server error",
              },
            },
          },
          delete: {
            summary: "Delete the order by Id",
            tags: ["Orders"],
            parameters: [
              {
                in: "path",
                name: "id",
                schema: {
                  type: "string",
                },
                required: true,
                description: "The order id",
              },
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              204: {
                description: "The order was successfully deleted",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "Order not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/orders/{orderId}/assign-manager/{managerId}": {
          put: {
            summary: "Assign a manager to an order",
            tags: ["Orders"],
            parameters: [
              {
                in: "path",
                name: "orderId",
                required: true,
                schema: {
                  type: "string",
                },
                description: "The ID of the order",
              },
              {
                in: "path",
                name: "managerId",
                required: true,
                schema: {
                  type: "string",
                },
                description: "The ID of the manager to assign",
              },
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "Manager was successfully assigned to the order",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
              400: {
                description: "Invalid input or manager cannot be assigned",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              403: {
                description:
                  "Forbidden. The selected user does not have the Manager role",
              },
              404: {
                description: "Order or Manager not found",
              },
              409: {
                description: "Manager already assigned to this order",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/orders/{orderId}/unassign-manager": {
          put: {
            summary: "Unassign (remove) the manager from an order",
            tags: ["Orders"],
            parameters: [
              {
                in: "path",
                name: "orderId",
                required: true,
                schema: {
                  type: "string",
                },
                description: "The ID of the order",
              },
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description:
                  "Manager was successfully unassigned from the order",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
              400: {
                description: "Invalid input or manager cannot be unassigned",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "Order not found",
              },
              409: {
                description: "No manager assigned to this order",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/orders/{id}/comments": {
          post: {
            summary: "Add a comment to an order",
            tags: ["Orders"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string",
                },
                description: "The ID of the order",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      comment: {
                        type: "string",
                        description: "Comment text",
                      },
                    },
                    required: ["comment"],
                  },
                  example: {
                    comment: "Great service!",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Comment successfully added to the order",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "Order not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/orders/{id}/comments/{commentId}": {
          delete: {
            summary: "Delete a comment from an order",
            tags: ["Orders"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string",
                },
                description: "The ID of the order",
              },
              {
                in: "path",
                name: "commentId",
                required: true,
                schema: {
                  type: "string",
                },
                description: "The ID of the comment to delete",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              204: {
                description: "Comment successfully deleted, no content",
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "Order or comment not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/orders/{id}/delivery": {
          post: {
            summary: "Update delivery details of an order",
            tags: ["Orders"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string",
                },
                description: "The ID of the order",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Delivery",
                  },
                },
              },
            },
            responses: {
              200: {
                description:
                  "The order delivery details were successfully updated",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "Order not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/orders/{id}/receive": {
          post: {
            summary: "Mark products as received in an order",
            tags: ["Orders"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string",
                },
                description: "The ID of the order",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/OrderReceive",
                  },
                },
              },
            },
            responses: {
              200: {
                description:
                  "Products in the order were successfully marked as received",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "Order or products not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/orders/{id}/status": {
          put: {
            summary: "Update the status of an order",
            tags: ["Orders"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string",
                },
                description: "The ID of the order",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        enum: [
                          "Draft",
                          "In Process",
                          "Partially Received",
                          "Received",
                          "Canceled",
                        ],
                        description: "The new status of the order",
                      },
                    },
                    required: ["status"],
                  },
                  example: {
                    status: "In Process",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "The order status was successfully updated",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "The order was not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/products": {
          get: {
            summary:
              "Get the list of products with optional filters and sorting",
            tags: ["Products"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
              {
                in: "query",
                name: "manufacturer",
                schema: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  example: ["Apple", "Samsung"],
                },
                description: "Filter products by manufacturer(s)",
              },
              {
                in: "query",
                name: "search",
                schema: {
                  type: "string",
                },
                description:
                  "Search term for filtering products by name, manufacturer, or price",
              },
              {
                in: "query",
                name: "sortField",
                schema: {
                  type: "string",
                  enum: ["name", "price", "manufacturer", "createdOn"],
                  example: "name",
                },
                description: "Field to sort by",
              },
              {
                in: "query",
                name: "sortOrder",
                schema: {
                  type: "string",
                  enum: ["asc", "desc"],
                  example: "asc",
                },
                description: "Sort order (ascending or descending)",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "The list of the products",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Product",
                      },
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              500: {
                description: "Server error",
              },
            },
          },
          post: {
            summary: "Create a new product",
            tags: ["Products"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProductWithoutId",
                  },
                },
              },
            },
            responses: {
              201: {
                description: "The product was successfully created",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Product",
                    },
                  },
                },
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              409: {
                description: "Conflict, product already exists",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/products/all": {
          get: {
            summary:
              "Get the list of all products (no pagination, filters or sorting)",
            tags: ["Products"],
            parameters: [
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "The complete list of products",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Product",
                      },
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/products/{id}": {
          get: {
            summary: "Get the product by Id",
            tags: ["Products"],
            parameters: [
              {
                in: "path",
                name: "id",
                schema: {
                  type: "string",
                },
                required: true,
                description: "The product id",
              },
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "The product by Id",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Product",
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "The product was not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
          put: {
            summary: "Update the product by Id",
            tags: ["Products"],
            parameters: [
              {
                in: "path",
                name: "id",
                schema: {
                  type: "string",
                },
                required: true,
                description: "The product id",
              },
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProductWithoutId",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "The product was successfully updated",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Product",
                    },
                  },
                },
              },
              400: {
                description: "Validation error",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "The product was not found",
              },
              409: {
                description: "Conflict, unable to update the product",
              },
              500: {
                description: "Server error",
              },
            },
          },
          delete: {
            summary: "Delete the product by Id",
            tags: ["Products"],
            parameters: [
              {
                in: "path",
                name: "id",
                schema: {
                  type: "string",
                },
                required: true,
                description: "The product id",
              },
              {
                in: "header",
                name: "Authorization",
                required: true,
                schema: {
                  type: "string",
                  example: "Bearer <JWT token>",
                },
                description: "Bearer token for authentication",
              },
            ],
            security: [
              {
                BearerAuth: [],
              },
            ],
            responses: {
              204: {
                description: "The product was successfully deleted",
              },
              401: {
                description: "Unauthorized, missing or invalid token",
              },
              404: {
                description: "The product was not found",
              },
              409: {
                description: "Conflict, unable to delete the product",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
      },
      tags: [
        {
          name: "Customers",
          description: "Customers management service",
        },
        {
          name: "Notifications",
          description: "User notifications management",
        },
        {
          name: "Orders",
          description: "Orders management service",
        },
        {
          name: "Products",
          description: "Products management service",
        },
      ],
    },
    customOptions: {},
  };
  url = options.swaggerUrl || url;
  var urls = options.swaggerUrls;
  var customOptions = options.customOptions;
  var spec1 = options.swaggerDoc;
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: "StandaloneLayout",
  };
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions);

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth);
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction);
  }

  window.ui = ui;
};
