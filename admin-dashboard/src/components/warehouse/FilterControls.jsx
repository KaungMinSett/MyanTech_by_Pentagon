import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

export const FilterControls = ({
  warehouses,
  brands,
  categories,
  selectedValues,
  dispatch,
  onWarehouseChange,
  onBrandChange,
  onCategoryChange,
}) => (
  <div className="flex gap-4">
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <Select
        value={selectedValues.warehouse}
        onChange={onWarehouseChange}
        displayEmpty
      >
        <MenuItem value="">All Warehouses</MenuItem>
        {warehouses.map((warehouse) => (
          <MenuItem key={warehouse.id} value={warehouse.id}>
            {warehouse.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={selectedValues.brand}
        onChange={onBrandChange}
        displayEmpty
      >
        <MenuItem value="">All Brands</MenuItem>
        {brands.map((brand) => (
          <MenuItem key={brand.id} value={brand.id}>
            {brand.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={selectedValues.category}
        onChange={onCategoryChange}
        displayEmpty
      >
        <MenuItem value="">All Categories</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>
);
