import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addOrder } from "@/redux/features/orders/ordersSlice";
import { Calendar } from "lucide-react";
import { Modal } from "@/components/modal/modal.jsx";
import { CreateOrderForm } from "@/components/sales/CreateOrderForm";
import { useNavigate } from "react-router-dom";

export function OrdersPage() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const handleHistoryClick = () => {
    navigate("/sales/history");
  };

  const filteredOrders =
    startDate && endDate
      ? orders.filter((order) => {
          const orderDate = new Date(order.date);
          return (
            orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
          );
        })
      : orders;

  const handleCreateOrder = (newOrder) => {
    dispatch(addOrder(newOrder));
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                {startDate && endDate
                  ? `${new Date(startDate).toLocaleDateString()} - ${new Date(
                      endDate
                    ).toLocaleDateString()}`
                  : "Select date range"}
              </span>
            </button>
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 p-4 w-72">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Start
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      End
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
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
