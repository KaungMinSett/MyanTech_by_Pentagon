import { useEffect } from "react";
import { Button } from "@radix-ui/themes";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setDropdownVisibility,
  resetForm,
  setSelectedProductForm,
  setSelectedWarehouse,
  setQuantity,
  createInboundOrder,
  fetchProducts,
  fetchInboundOrders,
} from "@/redux/features/warehouse/warehouseSlice";
import { toastConfig } from "@/styles/toast";

export default function ProductForm() {
  const dispatch = useDispatch();
  const { products, warehouses, loading } = useSelector(
    (state) => state.warehouse
  );
  const form = useSelector((state) => state.warehouse.form);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(form.productInput.toLowerCase())
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(fetchProducts()),
          dispatch(fetchInboundOrders()),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to fetch initial data");
      }
    };
    fetchInitialData();
  }, [dispatch]);

  const handleDropdownBlur = (dropdown) => {
    setTimeout(
      () => dispatch(setDropdownVisibility({ dropdown, isVisible: false })),
      200
    );
  };

  const handleSave = async () => {
    if (!form.product || !form.warehouse || !form.quantity) {
      toast.error("Please fill in all required fields", toastConfig);
      return;
    }

    try {
      const inboundOrder = {
        product: form.product.id,
        warehouse: form.warehouse.id,
        quantity: parseInt(form.quantity),
        status: "pending",
      };

      await dispatch(createInboundOrder(inboundOrder)).unwrap();
      await dispatch(fetchInboundOrders());
      dispatch(resetForm());
      toast.success("Inbound order created successfully!", toastConfig);
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.detail || "Failed to create inbound order";
      toast.error(errorMessage, toastConfig);
    }
  };

  const renderProductInput = () => (
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
            dispatch(setSelectedProductForm({ name: e.target.value }))
          }
          onFocus={() =>
            dispatch(
              setDropdownVisibility({ dropdown: "product", isVisible: true })
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
                onMouseDown={() => dispatch(setSelectedProductForm(p))}
              >
                {p.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-2 max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          <Toaster />
          <div className="space-y-6">
            {renderProductInput()}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm bg-gray-50"
                  value={form.category?.name || ""}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm bg-gray-50"
                  value={form.brand?.name || ""}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Warehouse
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm"
                  value={form.warehouse?.id || ""}
                  onChange={(e) => {
                    const selectedWarehouse = warehouses.find(
                      (w) => w.id === Number(e.target.value)
                    );
                    if (selectedWarehouse) {
                      dispatch(setSelectedWarehouse(selectedWarehouse));
                    }
                  }}
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2.5 text-sm"
                  value={form.quantity}
                  onChange={(e) => dispatch(setQuantity(e.target.value))}
                  placeholder="Enter quantity"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {loading ? "Saving..." : "Create Inbound Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
