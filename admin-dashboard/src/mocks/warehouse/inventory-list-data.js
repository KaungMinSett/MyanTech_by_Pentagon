export const jsonData = {
    "warehouses": [
      {
        "id": 1,
        "name": "Main Warehouse",
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      {
        "id": 2,
        "name": "East Coast Warehouse",
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      {
        "id": 3,
        "name": "West Coast Warehouse",
        "latitude": 34.0522,
        "longitude": -118.2437
      }
    ],
    "categories": [
      {
        "id": 1,
        "name": "Laptops"
      },
      {
        "id": 2,
        "name": "Desktops"
      }
    ],
    "brands": [
      {
        "id": 1,
        "name": "Dell"
      },
      {
        "id": 2,
        "name": "HP"
      }
    ],
    "products": [
      {
        "id": 1,
        "name": "Dell Inspiron 15",
        "category_id": 1,
        "brand_id": 1,
        "description": "A powerful laptop with Intel i7."
      },
      {
        "id": 2,
        "name": "HP Pavilion",
        "category_id": 1,
        "brand_id": 2,
        "description": "Lightweight and affordable laptop."
      },
      {
        "id": 3,
        "name": "HP EliteDesk 800",
        "category_id": 2,
        "brand_id": 2,
        "description": "High-performance desktop for business use."
      },
      {
        "id": 4,
        "name": "Dell OptiPlex 7080",
        "category_id": 2,
        "brand_id": 1,
        "description": "Compact desktop with great power."
      }
    ],
    "inventory": [
      {
        "product_id": 1,
        "warehouse_id": 1,
        "quantity": 50
      },
      {
        "product_id": 2,
        "warehouse_id": 1,
        "quantity": 30
      },
      {
        "product_id": 3,
        "warehouse_id": 2,
        "quantity": 20
      },
      {
        "product_id": 4,
        "warehouse_id": 3,
        "quantity": 5
      },
      {
        "product_id": 1,
        "warehouse_id": 2,
        "quantity": 40
      },
      {
        "product_id": 2,
        "warehouse_id": 3,
        "quantity": 25
      }
    ]
  };