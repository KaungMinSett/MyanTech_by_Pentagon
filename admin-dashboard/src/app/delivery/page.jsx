import { useSelector } from "react-redux";
import { selectFilteredOrders } from "@/redux/features/orders/ordersSlice";
import { Package, Truck, MapPin } from "lucide-react";

export function DeliveryPage() {
  const allOrders = useSelector(selectFilteredOrders);
  const acceptedOrders = allOrders.filter(
    (order) => order.status === "Confirmed"
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="ml-3 text-xl font-semibold text-blue-900">
              {acceptedOrders.length}
            </span>
          </div>
          <p className="mt-2 text-sm text-blue-700">Pending Deliveries</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-green-600" />
            <span className="ml-3 text-xl font-semibold text-green-900">
              {acceptedOrders.filter((o) => o.status === "In Transit").length}
            </span>
          </div>
          <p className="mt-2 text-sm text-green-700">In Transit</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-purple-600" />
            <span className="ml-3 text-xl font-semibold text-purple-900">
              {acceptedOrders.filter((o) => o.status === "Delivered").length}
            </span>
          </div>
          <p className="mt-2 text-sm text-purple-700">Delivered Today</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Delivery Queue</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {acceptedOrders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Order {order.id}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{order.customer}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Pending Delivery
                </span>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {order.address || "Address not available"}
                </p>
                <p className="mt-2">Products: {order.products.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}