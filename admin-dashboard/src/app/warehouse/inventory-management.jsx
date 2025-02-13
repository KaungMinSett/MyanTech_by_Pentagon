import { useState } from "react";
import { Button } from "@radix-ui/themes";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormField,
  setDropdownVisibility,
  resetForm,
  setSelectedProductForm,
  createInboundOrder,
} from "@/redux/features/warehouse/warehouseSlice";

export default function ProductForm() {
  const dispatch = useDispatch();
  const { products, warehouses, brands, categories } = useSelector(
    (state) => state.warehouse
  );
  const form = useSelector((state) => state.warehouse.form);
  const user = useSelector((state) => state.auth.user);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(form.productInput.toLowerCase())
  );

  const handleDropdownBlur = (dropdown) => {
    setTimeout(
      () => dispatch(setDropdownVisibility({ dropdown, isVisible: false })),
      200
    );
  };

  const handleInputChange = (field, value) => {
    dispatch(setFormField({ field, value }));
  };

  const handleSave = () => {
    if (!form.product || !form.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      !form.product.category ||
      !form.product.brand ||
      !form.product.warehouse
    ) {
      toast.error("Invalid product data");
      return;
    }

    const newInboundOrder = {
      id: Date.now(),
      product: {
        id: form.product.id,
        name: form.product.name,
        sku: form.product.sku,
        category: {
          id: form.product.category.id,
          name: form.product.category.name,
        },
        brand: {
          id: form.product.brand.id,
          name: form.product.brand.name,
        },
      },
      warehouse: form.product.warehouse,
      quantity: parseInt(form.quantity),
      status: "pending",
      created_by: {
        id: user.id,
        name: user.name,
      },
      created_at: new Date().toISOString(),
    };

    dispatch(createInboundOrder(newInboundOrder));
    toast.success("Product submitted for approval!");

    // Reset all form inputs
    dispatch(resetForm());

    // Reset all dropdowns
    dispatch(setDropdownVisibility({ dropdown: "product", isVisible: false }));
    dispatch(setDropdownVisibility({ dropdown: "category", isVisible: false }));
    dispatch(setDropdownVisibility({ dropdown: "brand", isVisible: false }));
    dispatch(
      setDropdownVisibility({ dropdown: "warehouse", isVisible: false })
    );
  };

  return (
    <div className="mt-2 max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          <Toaster />

          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0">
                Product Name
              </label>
              <div className="relative">
                <input
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm"
                  placeholder="Type product name"
                  value={form.productInput}
                  onChange={(e) =>
                    handleInputChange("productInput", e.target.value)
                  }
                  onFocus={() =>
                    dispatch(
                      setDropdownVisibility({
                        dropdown: "product",
                        isVisible: true,
                      })
                    )
                  }
                  onBlur={() => handleDropdownBlur("product")}
                />
                {form.showDropdowns.product && filteredProducts.length > 0 && (
                  <div className="absolute w-full border rounded-md mt-1 bg-white max-h-40 overflow-auto z-10 shadow-lg">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 hover:bg-gray-100 cursor-pointer text-sm"
                        onMouseDown={() => {
                          dispatch(setSelectedProductForm(p));
                          dispatch(
                            setDropdownVisibility({
                              dropdown: "product",
                              isVisible: false,
                            })
                          );
                        }}
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0">
                Category
              </label>
              <div className="relative">
                <input
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm"
                  value={form.categoryInput}
                  onChange={(e) =>
                    handleInputChange("categoryInput", e.target.value)
                  }
                  onFocus={() =>
                    dispatch(
                      setDropdownVisibility({
                        dropdown: "category",
                        isVisible: true,
                      })
                    )
                  }
                  onBlur={() => handleDropdownBlur("category")}
                  placeholder="Select or type category"
                />
                {form.showDropdowns.category && (
                  <div className="absolute w-full border rounded-md mt-1 bg-white max-h-40 overflow-auto z-10 shadow-lg">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="p-2.5 hover:bg-gray-100 cursor-pointer text-sm"
                        onMouseDown={() => {
                          dispatch(
                            setFormField({
                              field: "categoryInput",
                              value: category.name,
                            })
                          );
                          dispatch(
                            setDropdownVisibility({
                              dropdown: "category",
                              isVisible: false,
                            })
                          );
                        }}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Brand Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0">
                Brand
              </label>
              <div className="relative">
                <input
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm"
                  value={form.brandInput}
                  onChange={(e) =>
                    handleInputChange("brandInput", e.target.value)
                  }
                  onFocus={() =>
                    dispatch(
                      setDropdownVisibility({
                        dropdown: "brand",
                        isVisible: true,
                      })
                    )
                  }
                  onBlur={() => handleDropdownBlur("brand")}
                  placeholder="Select or type brand"
                />
                {form.showDropdowns.brand && (
                  <div className="absolute w-full border rounded-md mt-1 bg-white max-h-40 overflow-auto z-10 shadow-lg">
                    {brands.map((brand) => (
                      <div
                        key={brand.id}
                        className="p-2.5 hover:bg-gray-100 cursor-pointer text-sm"
                        onMouseDown={() => {
                          dispatch(
                            setFormField({
                              field: "brandInput",
                              value: brand.name,
                            })
                          );
                          dispatch(
                            setDropdownVisibility({
                              dropdown: "brand",
                              isVisible: false,
                            })
                          );
                        }}
                      >
                        {brand.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Warehouse Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0">
                Warehouse
              </label>
              <div className="relative">
                <input
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm"
                  value={form.warehouseInput}
                  onChange={(e) =>
                    handleInputChange("warehouseInput", e.target.value)
                  }
                  onFocus={() =>
                    dispatch(
                      setDropdownVisibility({
                        dropdown: "warehouse",
                        isVisible: true,
                      })
                    )
                  }
                  onBlur={() => handleDropdownBlur("warehouse")}
                  placeholder="Select warehouse"
                />
                {form.showDropdowns.warehouse && (
                  <div className="absolute w-full border rounded-md mt-1 bg-white max-h-40 overflow-auto z-10 shadow-lg">
                    {warehouses.map((warehouse) => (
                      <div
                        key={warehouse.id}
                        className="p-2.5 hover:bg-gray-100 cursor-pointer text-sm"
                        onMouseDown={() => {
                          dispatch(
                            setFormField({
                              field: "warehouseInput",
                              value: warehouse.name,
                            })
                          );
                          dispatch(
                            setDropdownVisibility({
                              dropdown: "warehouse",
                              isVisible: false,
                            })
                          );
                        }}
                      >
                        {warehouse.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm min-h-[80px]"
                value={form.descriptionInput}
                onChange={(e) =>
                  handleInputChange("descriptionInput", e.target.value)
                }
                placeholder="Enter product description"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0">
                Quantity
              </label>
              <input
                className="w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm"
                type="number"
                value={form.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-1">
            <Button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
