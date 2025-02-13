export const inventoryData = {
  warehouses: [
    {
      id: 1,
      name: "San Francisco Warehouse",
      latitude: 37.7749,
      longitude: -122.4194,
    },
    {
      id: 2,
      name: "Los Angeles Warehouse",
      latitude: 34.0522,
      longitude: -118.2437,
    },
    {
      id: 3,
      name: "New York Warehouse",
      latitude: 40.7128,
      longitude: -74.006,
    },
  ],
  categories: [
    {
      id: 1,
      name: "Laptops",
    },
    {
      id: 2,
      name: "Desktops",
    },
  ],
  brands: [
    {
      id: 1,
      name: "Dell",
    },
    {
      id: 2,
      name: "Apple",
    },
    {
      id: 3,
      name: "HP",
    },
  ],
  products: [
    {
      id: 1,
      name: "Dell XPS 15",
      sku: "DELL-XPS-15",
      category_id: 1,
      brand_id: 1,
      description: "High-performance laptop with Intel i7 and 16GB RAM.",
    },
    {
      id: 2,
      name: "Apple MacBook Pro 16",
      sku: "APP-MBP-16",
      category_id: 1,
      brand_id: 2,
      description: "Apple MacBook Pro with M2 chip and 32GB RAM.",
    },
    {
      id: 3,
      name: "HP EliteDesk 800",
      sku: "HP-ED-800",
      category_id: 2,
      brand_id: 3,
      description: "High-performance desktop for business use.",
    },
  ],
  inventory: [
    {
      product_id: 1,
      warehouse_id: 1,
      quantity: 30,
    },
    {
      product_id: 1,
      warehouse_id: 2,
      quantity: 20,
    },
    {
      product_id: 2,
      warehouse_id: 1,
      quantity: 25,
    },
    {
      product_id: 2,
      warehouse_id: 3,
      quantity: 15,
    },
    {
      product_id: 3,
      warehouse_id: 2,
      quantity: 20,
    },
  ],
};
