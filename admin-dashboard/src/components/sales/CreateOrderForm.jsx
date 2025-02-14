import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DialogContent from "@mui/material/DialogContent";
import { toast } from "react-hot-toast";
import axiosInstance from "@/api/axios";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

export function CreateOrderForm({ customer, onClose }) {
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/shop/productlist/");
        setProducts(response.data);
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  const [formData, setFormData] = useState({
    customer: customer?.id,
    address: customer?.address[0]?.id,
    order_items: [{ product: "", quantity: 1, unit_price: "0.00" }],
    order_type: "website",
    status: "Pending",
    warehouse_ready: false,
    reconciliation_status: "PENDING",
    employee: 2,
  });

  const orderTypes = ["website", "phone", "in_store"];

  const handleOrderTypeChange = (event) => {
    setFormData({ ...formData, order_type: event.target.value });
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.order_items];
    if (field === "product") {
      const selectedProduct = products.find((p) => p.id === parseInt(value));
      if (selectedProduct) {
        newProducts[index] = {
          ...newProducts[index],
          product: selectedProduct.id,
          unit_price: selectedProduct.details.price || "0.00",
        };
      }
    } else if (field === "quantity") {
      newProducts[index] = {
        ...newProducts[index],
        quantity: parseInt(value) || 1,
      };
    }
    setFormData({ ...formData, order_items: newProducts });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      order_items: [
        ...formData.order_items,
        { product: "", quantity: 1, unit_price: "0.00" },
      ],
    });
  };

  const removeProduct = (index) => {
    const newProducts = formData.order_items.filter((_, i) => i !== index);
    setFormData({ ...formData, order_items: newProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (formData.order_items.some((item) => !item.product)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/sales/api/orders/", formData);
      toast.success("Order created successfully!");
      onClose();
    } catch (error) {
      console.error("Create Order Error:", error);
      toast.error(error?.response?.data?.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormControl fullWidth>
          <InputLabel>Order Type</InputLabel>
          <Select
            value={formData.order_type}
            onChange={handleOrderTypeChange}
            label="Order Type"
          >
            {orderTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="space-y-4">
          {formData.order_items.map((item, index) => (
            <div key={index} className="flex gap-4 items-start">
              <FormControl className="flex-grow">
                <InputLabel>Product</InputLabel>
                <Select
                  value={item.product}
                  onChange={(e) =>
                    handleProductChange(index, "product", e.target.value)
                  }
                  label="Product"
                  required
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} - ${product.details.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                type="number"
                label="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleProductChange(index, "quantity", e.target.value)
                }
                inputProps={{ min: 1 }}
                required
                sx={{ width: "120px" }}
              />

              {formData.order_items.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeProduct(index)}
                  color="error"
                  variant="outlined"
                  size="small"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          onClick={addProduct}
          variant="outlined"
          size="small"
          startIcon={<span>+</span>}
        >
          Add Product
        </Button>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            color="primary"
          >
            {isSubmitting ? "Creating..." : "Create Order"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
