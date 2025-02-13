import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addOrder } from "@/redux/features/orders/ordersSlice";
import {
  addOrder,
  setDateFilter,
  selectFilteredOrders,
  setSearchQuery,
} from "@/redux/features/orders/ordersSlice";
import { Calendar } from "lucide-react";
import { Modal } from "@/components/modal/modal.jsx";
import { CreateOrderForm } from "@/components/sales/CreateOrderForm";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export function OrdersPage() {
  const dispatch = useDispatch();
  const filteredOrders = useSelector(selectFilteredOrders);
  const dateFilter = useSelector((state) => state.orders.dateFilter);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateOrder = (newOrder) => {
    dispatch(addOrder(newOrder));
    setShowCreateModal(false);
  };

  const handleDateFilterChange = (startDate, endDate) => {
    dispatch(setDateFilter({ startDate, endDate }));
  };

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button
              variant="outlined"
              size="small"
              color="gray"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm"
            >
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                {dateFilter.startDate && dateFilter.endDate
                  ? `${new Date(
                      dateFilter.startDate
                    ).toLocaleDateString()} - ${new Date(
                      dateFilter.endDate
                    ).toLocaleDateString()}`
                  : "Select date range"}
              </span>
            </Button>
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 p-4 w-72">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Start
                    </label>
                    <input
                      type="date"
                      value={dateFilter.startDate}
                      onChange={(e) =>
                        handleDateFilterChange(
                          e.target.value,
                          dateFilter.endDate
                        )
                      }
                      className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      End
                    </label>
                    <input
                      type="date"
                      value={dateFilter.endDate}
                      onChange={(e) =>
                        handleDateFilterChange(
                          dateFilter.startDate,
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm bg-[#0066FF] text-white rounded-md hover:bg-[#0052CC] transition-colors"
            >
              Create Order
            </button>

            <Modal
              open={showCreateModal}
              onOpenChange={setShowCreateModal}
              title="Create New Order"
              trapFocus={false}
            >
              <CreateOrderForm onSubmit={handleCreateOrder} />
            </Modal>
          </div>
        </div>
      </div>

      <div className="rounded-md border overflow-y-auto overflow-x-hidden max-h-[calc(100vh-200px)]">
        <table className="w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Products
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Payment
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Items
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Issued By
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  navigate(`/sales/orders/${order.id.replace("#", "")}`)
                }
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="max-w-xs truncate">
                    {order.products.join(", ")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 text-sm text-black max-w-[300px] break-words">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.order_type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-[150px] break-words">
                 {order.employee}
                </td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
