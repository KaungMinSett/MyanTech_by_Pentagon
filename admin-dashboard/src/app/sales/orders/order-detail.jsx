import { useParams } from 'react-router-dom';
import { orders } from '@/mocks/sales/orders';
import { deliveredOrders } from '@/mocks/sales/order-history';

export function OrderDetailPage() {
  const { id } = useParams();
  const formattedId = `#${id}`;
  
  const order = orders.find(o => o.id === formattedId) || 
                deliveredOrders.find(o => o.id === formattedId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mt-4">Sales Order {order.id}</h1>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-8">
          <div>
            <h3 className="text-base font-medium text-gray-900">Sale Information</h3>
            <hr className="my-3 border-gray-200" />
            <div className="space-y-2.5">
              <div className="text-sm">
                <span className="text-gray-500">Order Date: </span>
                <span className="text-gray-900">{order.date}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Status: </span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  order.payment === "Success" 
                    ? "bg-green-50 text-green-700" 
                    : "bg-yellow-50 text-yellow-700"
                }`}>
                  {order.payment}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium text-gray-900">Last Delivery Orders</h3>
            <hr className="my-3 border-gray-200" />
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-900">WH/OUT/00002</div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    Shipped
                  </span>
                  <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    RETURN
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Date: {order.date}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900">Invoicing and Shipping Address</h3>
          <hr className="my-3 border-gray-200" />
          <div className="space-y-2 text-sm">
            <div className="text-gray-900">{order.customer}</div>
            <div className="text-gray-600">{order.address}</div>
            <div className="text-gray-600">{order.phone}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900">Products</h3>
        <hr className="my-3 border-gray-200" />
        <div className="mt-2 ring-1 ring-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disc.%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.products.map((product, index) => (
                <tr key={index} className="text-sm">
                  <td className="px-6 py-4 text-gray-900">{product}</td>
                  <td className="px-6 py-4 text-gray-500">1</td>
                  <td className="px-6 py-4 text-gray-500">-</td>
                  <td className="px-6 py-4 text-gray-500">5%</td>
                  <td className="px-6 py-4 text-gray-500">15%</td>
                  <td className="px-6 py-4 text-gray-500">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}