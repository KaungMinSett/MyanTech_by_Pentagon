import { useState, useEffect } from "react";
import { Package2, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { Modal } from "@/components/modal/modal";
import {
  approveInboundOrder,
  rejectInboundOrder,
  selectPendingInboundOrders,
  fetchInboundOrders,
  fetchProducts,
} from "@/redux/features/warehouse/warehouseSlice";
import { toast } from "react-hot-toast";

export default function ConfirmProducts() {
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [actionType, setActionType] = useState("");

  const pendingItems = useSelector(selectPendingInboundOrders);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProducts()).unwrap();
        await dispatch(fetchInboundOrders()).unwrap();
      } catch (error) {
        toast.error("Failed to fetch pending items");
      }
    };
    fetchData();
  }, [dispatch]);

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handleAction = async (action) => {
    const count = selectedItems.length;
    try {
      for (const itemId of selectedItems) {
        if (action === "confirm") {
          await dispatch(approveInboundOrder({ orderId: itemId })).unwrap();
        } else {
          await dispatch(rejectInboundOrder({ orderId: itemId })).unwrap();
        }
      }

      setSelectedItems([]);
      setActionType(action);
      setModalMessage(
        `${count} item${count !== 1 ? "s" : ""} have been ${
          action === "confirm" ? "approved and added to inventory" : "declined"
        }.`
      );
      setShowActionModal(false);
      setShowResultModal(true);
    } catch (error) {
      toast.error("Failed to process items: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden relative">
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
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
            onClick={() => setShowActionModal(true)}
            disabled={selectedItems.length === 0}
            className="flex items-center"
          >
            Action
          </Button>
        </div>
      )}

      <Modal open={showActionModal} onOpenChange={setShowActionModal}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Select Action for Selected Items
          </h3>
          <div className="space-y-4">
            <Button
              variant="outlined"
              color="success"
              fullWidth
              onClick={() => handleAction("confirm")}
              className="flex items-center justify-center"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm Items
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => handleAction("reject")}
              className="flex items-center justify-center"
            >
              <X className="h-4 w-4 mr-2" />
              Reject Items
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={showResultModal} onOpenChange={setShowResultModal}>
        <div className="p-6">
          <div className="text-center">
            <div
              className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                actionType === "confirm" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {actionType === "confirm" ? (
                <Check className="h-6 w-6 text-green-600" />
              ) : (
                <X className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <div className="mt-2">
                <p className="text-sm text-gray-500">{modalMessage}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setShowResultModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
