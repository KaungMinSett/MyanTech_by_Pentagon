import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import {
  fetchProducts,
  fetchInboundOrders,
  fetchOutboundOrders,
} from "@/redux/features/warehouse/warehouseSlice";
import { StatusBadge } from "@/components/warehouse/StatusBadge";
import { TableHeader } from "@/components/warehouse/TableHeader";

// Table row component
const OrderRow = ({ item, index }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {index + 1}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {item.product.name}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {item.warehouse.name}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {item.quantity}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <StatusBadge status={item.status} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {item.created_by.name}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(item.created_at).toLocaleString()}
    </td>
  </tr>
);

// Tab trigger component
const TabTrigger = ({ value, activeTab }) => (
  <Tabs.Trigger
    value={value}
    className={`px-4 py-2 text-sm font-medium ${
      activeTab === value
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {value.charAt(0).toUpperCase() + value.slice(1)}
  </Tabs.Trigger>
);

const TABLE_HEADERS = [
  "No",
  "Product",
  "Warehouse",
  "Quantity",
  "Status",
  "Created By",
  "Created At",
];

const OUTBOUND_HEADERS = [
  "No",
  "Order ID",
  "Products",
  "Customer",
  "Quantity",
  "Status",
  "Created At",
];

const OutboundRow = ({ item, index }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {index + 1}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {item.order_reference}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <div className="max-w-xs truncate">
        {Array.isArray(item.products)
          ? item.products.join(", ")
          : item.products}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {item.customer}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {item.quantity}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <StatusBadge status={item.status} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(item.created_at).toLocaleString()}
    </td>
  </tr>
);

export default function InboundOutbound() {
  const [activeTab, setActiveTab] = useState("inbound");
  const dispatch = useDispatch();
  const { inboundOrders, outboundOrders, loading, error } = useSelector(
    (state) => state.warehouse
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchProducts()).unwrap(),
          dispatch(fetchInboundOrders()).unwrap(),
          dispatch(fetchOutboundOrders()).unwrap(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading data: {error}
      </div>
    );
  }

  const renderInboundTable = () => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="max-h-[calc(100vh-190px)] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader headers={TABLE_HEADERS} />
          <tbody className="bg-white divide-y divide-gray-200">
            {inboundOrders.map((item, index) => (
              <OrderRow key={item.id} item={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOutboundTable = () => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="max-h-[calc(100vh-190px)] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader headers={OUTBOUND_HEADERS} />
          <tbody className="bg-white divide-y divide-gray-200">
            {outboundOrders.map((item, index) => (
              <OutboundRow key={item.id} item={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <Tabs.List className="flex space-x-4 border-b">
          <TabTrigger value="inbound" activeTab={activeTab} />
          <TabTrigger value="outbound" activeTab={activeTab} />
        </Tabs.List>

        <Tabs.Content value="inbound" className="space-y-4">
          {renderInboundTable()}
        </Tabs.Content>

        <Tabs.Content value="outbound" className="space-y-4">
          {renderOutboundTable()}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
