export const reportData = {
    "prices": [
      {
        "product": 1,
        "price": 99.99,
        "is_published": true,
        "image": "product_images/sample_image1.jpg"
      },
      {
        "product": 2,
        "price": 150.50,
        "is_published": true,
        "image": "product_images/sample_image2.jpg"
      },
      {
        "product": 3,
        "price": 75.00,
        "is_published": true,
        "image": "product_images/sample_image3.jpg"
      },
      {
        "product": 4,
        "price": 250.00,
        "is_published": false,
        "image": "product_images/sample_image4.jpg"
      }
    ],
    "orders": [
      {
        "customer": 1,
        "address": 1,
        "employee": 2,
        "order_date": "2025-02-13T10:00:00Z",
        "order_type": "website",
        "status": "Pending",
        "warehouse_ready": false,
        "created_at": "2025-02-13T09:00:00Z",
        "updated_at": "2025-02-13T10:00:00Z",
        "reconciliation_status": "PENDING"
      },
      {
        "customer": 2,
        "address": 2,
        "employee": 3,
        "order_date": "2025-02-12T14:30:00Z",
        "order_type": "phone",
        "status": "Approved",
        "warehouse_ready": true,
        "created_at": "2025-02-12T13:30:00Z",
        "updated_at": "2025-02-12T14:30:00Z",
        "reconciliation_status": "CONFIRMED"
      },
      {
        "customer": 3,
        "address": 3,
        "employee": 1,
        "order_date": "2025-02-11T09:15:00Z",
        "order_type": "website",
        "status": "Delivered",
        "warehouse_ready": true,
        "created_at": "2025-02-11T08:15:00Z",
        "updated_at": "2025-02-11T09:15:00Z",
        "reconciliation_status": "CONFIRMED"
      }
    ],
    "order_items": [
      {
        "order": 1,
        "product": 1,
        "quantity": 2,
        "unit_price": 99.99
      },
      {
        "order": 1,
        "product": 2,
        "quantity": 1,
        "unit_price": 150.50
      },
      {
        "order": 2,
        "product": 3,
        "quantity": 4,
        "unit_price": 75.00
      },
      {
        "order": 2,
        "product": 4,
        "quantity": 1,
        "unit_price": 250.00
      },
      {
        "order": 3,
        "product": 2,
        "quantity": 1,
        "unit_price": 150.50
      }
    ],
    "order_logs": [
      {
        "order": 1,
        "action": "Created",
        "description": "Order created with pending status",
        "created_at": "2025-02-13T09:00:00Z"
      },
      {
        "order": 1,
        "action": "Confirmed",
        "description": "Order status updated to approved",
        "created_at": "2025-02-13T10:00:00Z"
      },
      {
        "order": 2,
        "action": "Created",
        "description": "Order created with approved status",
        "created_at": "2025-02-12T13:30:00Z"
      },
      {
        "order": 2,
        "action": "Delivered",
        "description": "Order status updated to delivered",
        "created_at": "2025-02-12T15:00:00Z"
      },
      {
        "order": 3,
        "action": "Created",
        "description": "Order created with delivered status",
        "created_at": "2025-02-11T08:15:00Z"
      }
    ]
  }
  