import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="outlined"
            className="px-4 py-2 text-sm"
            size="small"
          >
            Create Order
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="w-[12%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="w-[28%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="w-[12%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="w-[18%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="w-[12%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="w-[8%] px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                    onClick={() =>
                      navigate(`/sales/orders/${order.id.replace("#", "")}`)
                    }
                  >
                    {order.id}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-500 cursor-pointer"
                    onClick={() =>
                      navigate(`/sales/orders/${order.id.replace("#", "")}`)
                    }
                  >
                    <div className="truncate">{order.products.join(", ")}</div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                    onClick={() =>
                      navigate(`/sales/orders/${order.id.replace("#", "")}`)
                    }
                  >
                    {order.date}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                    onClick={() =>
                      navigate(`/sales/orders/${order.id.replace("#", "")}`)
                    }
                  >
                    {order.customer}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    onClick={() =>
                      navigate(`/sales/orders/${order.id.replace("#", "")}`)
                    }
                  >
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
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                    onClick={() =>
                      navigate(`/sales/orders/${order.id.replace("#", "")}`)
                    }
                  >
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                    <div className="relative inline-block text-left">
                      <button className="p-1.5 rounded-full hover:bg-gray-100">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      <div className="hidden group-hover:block absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                        <div className="py-1 flex flex-col">
                          <button
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Edit Order
                          </button>
                          <button
                            className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete
                            }}
                          >
                            Delete Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        title="Create New Order"
      >
        <CreateOrderForm onSubmit={handleCreateOrder} />
      </Modal>
    </div>
  );
}
