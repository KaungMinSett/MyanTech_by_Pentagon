import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setDateFilter,
  selectFilteredOrders,
  setSearchQuery,
  fetchOrders,
  clearOrderNotifications,
  acceptOrder,
  rejectOrder,
} from "@/redux/features/orders/ordersSlice";
import { Calendar, Check, X } from "lucide-react";
import { Modal } from "@/components/modal/modal.jsx";
import { CreateOrderForm } from "@/components/sales/CreateOrderForm";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export function OrdersPage() {
  const dispatch = useDispatch();
  const filteredOrders = useSelector(selectFilteredOrders);
  const dateFilter = useSelector((state) => state.orders.dateFilter);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(clearOrderNotifications());
  }, [dispatch]);

  const handleCreateOrder = (newOrder) => {
    dispatch(addOrder(newOrder));
    setShowCreateModal(false);
  };

  const handleDateFilterChange = (startDate, endDate) => {
    dispatch(setDateFilter({ startDate, endDate }));
  };

  const handleAcceptOrder = (orderId) => {
    dispatch(acceptOrder(orderId));
  };

  const handleRejectOrder = (orderId) => {
    dispatch(rejectOrder(orderId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/sales/orders/${order.id.replace('#', '')}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="max-w-xs truncate">
                    {Array.isArray(order.products) ? order.products.join(", ") : order.products}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    order.payment === "Success" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.payment}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.items}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptOrder(order.id);
                      }}
                      className="p-1.5 hover:bg-green-50 rounded-full transition-colors"
                      title="Accept Order"
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRejectOrder(order.id);
                      }}
                      className="p-1.5 hover:bg-red-50 rounded-full transition-colors"
                      title="Reject Order"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <CreateOrderForm onClose={() => setShowCreateModal(false)} />
        </Modal>
      )}
    </div>
  );
}
