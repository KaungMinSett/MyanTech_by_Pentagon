import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";
import {
  setDateFilter,
  selectFilteredOrders,
  fetchOrders,
  clearOrderNotifications,
  acceptOrder,
  rejectOrder,
} from "@/redux/features/orders/ordersSlice";

const TableHeader = ({ label }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
    {label}
  </th>
);

const ActionButton = ({ onClick, className, title, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-full transition-colors ${className}`}
    title={title}
  >
    <Icon className="h-4 w-4" />
  </button>
);

export function OrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filteredOrders = useSelector(selectFilteredOrders);
  const dateFilter = useSelector((state) => state.orders.dateFilter);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(clearOrderNotifications());
  }, [dispatch]);

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
              {[
                "Order ID",
                "Products",
                "Date",
                "Customer",
                "Payment",
                "Total",
                "Items",
                "Actions",
              ].map((header) => (
                <TableHeader key={header} label={header} />
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="max-w-xs truncate">
                    {Array.isArray(order.products)
                      ? order.products.join(", ")
                      : order.products}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      order.payment === "Success"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
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
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptOrder(order.id);
                      }}
                      className="hover:bg-green-50"
                      title="Accept Order"
                      icon={(props) => (
                        <Check {...props} className="text-green-600" />
                      )}
                    />
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRejectOrder(order.id);
                      }}
                      className="hover:bg-red-50"
                      title="Reject Order"
                      icon={(props) => (
                        <X {...props} className="text-red-600" />
                      )}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
