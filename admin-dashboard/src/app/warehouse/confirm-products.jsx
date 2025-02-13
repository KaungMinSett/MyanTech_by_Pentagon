import { useState } from "react";
import { Package2, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { Modal } from "@/components/modal/modal";
import {
  approveInboundOrder,
  selectPendingInboundOrders,
} from "@/redux/features/warehouse/warehouseSlice";

export default function ConfirmProducts() {
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedCount, setConfirmedCount] = useState(0);

  const pendingItems = useSelector(selectPendingInboundOrders);

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handleConfirmSelected = () => {
    const count = selectedItems.length;
    selectedItems.forEach((itemId) => {
      dispatch(approveInboundOrder({ orderId: itemId }));
    });
    setSelectedItems([]);
    setConfirmedCount(count);
    setShowSuccessModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package2 className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Confirm Products</h1>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden relative">
        <div className="max-h-[calc(100vh-230px)] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === pendingItems.length &&
                      pendingItems.length > 0
                    }
                    onChange={() => {
                      if (selectedItems.length === pendingItems.length) {
                        setSelectedItems([]);
                      } else {
                        setSelectedItems(pendingItems.map((item) => item.id));
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.product.sku}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.warehouse.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.created_by.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pendingItems.length > 0 && (
        <div className="flex justify-end mr-6">
          <Button
            variant="outlined"
            onClick={handleConfirmSelected}
            disabled={selectedItems.length === 0}
            className="flex items-center"
          >
            <Check className="h-4 w-4 mr-2" />
            Confirm
          </Button>
        </div>
      )}

      <Modal open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {confirmedCount} item{confirmedCount !== 1 ? "s" : ""} have
                  been approved and added to inventory.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
