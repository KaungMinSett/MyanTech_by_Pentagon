import { useState, useMemo } from "react";
import { saveAs } from "file-saver";
import { Heading, Text } from "@radix-ui/themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  LabelList,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  CheckCircle,
  Hourglass,
  Printer,
  FileText,
  Share,
} from "lucide-react";
const dummyOrders = [
  {
    id: 1,
    customer: "John Doe",
    status: "Delivered",
    total_price: 250.75,
    order_date: "2024-02-01",
  },
  {
    id: 2,
    customer: "Jane Smith",
    status: "Pending",
    total_price: 180.5,
    order_date: "2024-02-05",
  },
  {
    id: 3,
    customer: "Robert Brown",
    status: "Approved",
    total_price: 320.2,
    order_date: "2024-02-10",
  },
  {
    id: 4,
    customer: "Emily Johnson",
    status: "Cancelled",
    total_price: 90.0,
    order_date: "2024-02-12",
  },
  {
    id: 5,
    customer: "Michael Lee",
    status: "Delivered",
    total_price: 410.8,
    order_date: "2024-02-15",
  },
  {
    id: 6,
    customer: "Sarah Davis",
    status: "Pending",
    total_price: 150.0,
    order_date: "2024-02-16",
  },
  {
    id: 7,
    customer: "David Wilson",
    status: "Approved",
    total_price: 500.4,
    order_date: "2024-02-18",
  },
  {
    id: 8,
    customer: "Alice Taylor",
    status: "Delivered",
    total_price: 220.3,
    order_date: "2024-02-20",
  },
  {
    id: 9,
    customer: "Chris Evans",
    status: "Cancelled",
    total_price: 180.9,
    order_date: "2024-02-22",
  },
  {
    id: 10,
    customer: "Megan Harris",
    status: "Delivered",
    total_price: 270.6,
    order_date: "2024-02-25",
  },

  // Additional past data
  {
    id: 11,
    customer: "Luke Sky",
    status: "Delivered",
    total_price: 150.75,
    order_date: "2024-01-05",
  },
  {
    id: 12,
    customer: "Steve Rogers",
    status: "Pending",
    total_price: 140.2,
    order_date: "2024-01-10",
  },
  {
    id: 13,
    customer: "Natasha Romanoff",
    status: "Approved",
    total_price: 210.0,
    order_date: "2024-01-12",
  },
  {
    id: 14,
    customer: "Tony Stark",
    status: "Cancelled",
    total_price: 340.3,
    order_date: "2024-01-15",
  },
  {
    id: 15,
    customer: "Bruce Wayne",
    status: "Delivered",
    total_price: 290.4,
    order_date: "2024-01-20",
  },
  {
    id: 16,
    customer: "Diana Prince",
    status: "Pending",
    total_price: 220.8,
    order_date: "2024-01-25",
  },
  {
    id: 17,
    customer: "Clark Kent",
    status: "Approved",
    total_price: 370.2,
    order_date: "2024-01-28",
  },
  {
    id: 18,
    customer: "Barry Allen",
    status: "Delivered",
    total_price: 400.1,
    order_date: "2024-01-30",
  },

  // Even older data
  {
    id: 19,
    customer: "Wade Wilson",
    status: "Cancelled",
    total_price: 100.1,
    order_date: "2023-12-01",
  },
  {
    id: 20,
    customer: "Hal Jordan",
    status: "Delivered",
    total_price: 230.4,
    order_date: "2023-12-05",
  },

  // Additional past data
  {
    id: 11,
    customer: "Luke Sky",
    status: "Delivered",
    total_price: 150.75,
    order_date: "2023-12-04",
  },
  {
    id: 12,
    customer: "Steve Rogers",
    status: "Pending",
    total_price: 140.2,
    order_date: "2023-12-10",
  },
  {
    id: 13,
    customer: "Natasha Romanoff",
    status: "Approved",
    total_price: 210.0,
    order_date: "2023-12-12",
  },
  {
    id: 14,
    customer: "Tony Stark",
    status: "Cancelled",
    total_price: 340.3,
    order_date: "2023-12-15",
  },
  {
    id: 15,
    customer: "Bruce Wayne",
    status: "Delivered",
    total_price: 290.4,
    order_date: "2023-12-20",
  },
  {
    id: 16,
    customer: "Diana Prince",
    status: "Pending",
    total_price: 220.8,
    order_date: "2023-11-25",
  },
  {
    id: 17,
    customer: "Clark Kent",
    status: "Approved",
    total_price: 370.2,
    order_date: "2023-11-28",
  },
  {
    id: 18,
    customer: "Barry Allen",
    status: "Delivered",
    total_price: 400.1,
    order_date: "2023-11-30",
  },
];

const totalRevenue = dummyOrders.reduce(
  (acc, order) => acc + order.total_price,
  0
);
const deliveredRevenue = dummyOrders
  .filter((order) => order.status === "Delivered")
  .reduce((acc, order) => acc + order.total_price, 0);

const pendingRevenue = dummyOrders
  .filter((order) => order.status === "Pending")
  .reduce((acc, order) => acc + order.total_price, 0);

const statusData = [
  {
    name: "Delivered",
    value: dummyOrders.filter((o) => o.status === "Delivered").length,
  },
  {
    name: "Pending",
    value: dummyOrders.filter((o) => o.status === "Pending").length,
  },
  {
    name: "Approved",
    value: dummyOrders.filter((o) => o.status === "Approved").length,
  },
  {
    name: "Cancelled",
    value: dummyOrders.filter((o) => o.status === "Cancelled").length,
  },
];

const COLORS = ["#00C49F", "#FFBB28", "#0088FE", "#FF8042"];

export default function SalesReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("order_date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleExport = () => {
    const header = ["Order ID", "Customer", "Status", "Total Price", "Date"];
    const rows = dummyOrders.map((order) => [
      order.id,
      order.customer,
      order.status,
      order.total_price.toFixed(2),
      order.order_date,
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "sales_report.csv");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(
      "<html><head><title>Sales Report</title></head><body>"
    );
    printWindow.document.write(
      document.getElementById("sales-report").innerHTML
    );
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Sales Report",
          text: "Check out this sales report!",
          url: window.location.href,
        })
        .then(() => console.log("Report shared successfully"))
        .catch((error) => console.log("Error sharing report:", error));
    } else {
      alert("Share feature is not supported on this device");
    }
  };

  // Calculate revenue growth from last month
  const lastMonthOrders = dummyOrders.filter((order) => {
    const orderDate = new Date(order.order_date);
    const now = new Date();
    return (
      orderDate.getMonth() === now.getMonth() - 1 &&
      orderDate.getFullYear() === now.getFullYear()
    );
  });

  const lastMonthRevenue = lastMonthOrders.reduce(
    (acc, order) => acc + order.total_price,
    0
  );
  const growthFromLastMonth = totalRevenue - lastMonthRevenue;
  const growthPercentage = (
    (growthFromLastMonth / lastMonthRevenue) *
    100
  ).toFixed(2);

  const averageOrderValue = totalRevenue / dummyOrders.length;
  const filteredOrders = dummyOrders.filter(
    (order) =>
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = filteredOrders.sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Group orders by month
  const orderChartData = useMemo(() => {
    const salesByMonth = {};

    dummyOrders.forEach((order) => {
      const monthYear = new Date(order.order_date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!salesByMonth[monthYear]) {
        salesByMonth[monthYear] = 0;
      }
      salesByMonth[monthYear] += order.total_price;
    });

    return Object.keys(salesByMonth).map((month) => ({
      name: month,
      total: salesByMonth[month],
    }));
  }, [dummyOrders]);

  // Calculate the percentage of each status
  const totalOrders = dummyOrders.length;
  const statusPercentages = statusData.map((item) => ({
    ...item,
    percentage: ((item.value / totalOrders) * 100).toFixed(2),
  }));

  return (
    <div className="space-y-6">
   
  
    <div className="flex justify-end space-x-4 mb-6">
      <button
        onClick={handleExport}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md text-gray-600 border-gray-300 hover:text-blue-600 hover:border-blue-600"
      >
        <FileText className="text-lg" />
        <span>Export</span>
      </button>
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md text-gray-600 border-gray-300 hover:text-blue-600 hover:border-blue-600"
      >
        <Printer className="text-lg" />
        <span>Print</span>
      </button>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md text-gray-600 border-gray-300 hover:text-blue-600 hover:border-blue-600"
      >
        <Share className="text-lg" />
        <span>Share</span>
      </button>
    </div>
  
    <div className="grid grid-cols-2 gap-6">
      {/* Total Revenue */}
      <div className="p-4 rounded-md border border-gray-300 shadow-md bg-white flex items-center space-x-4">
        <DollarSign className="text-2xl text-green-500" />
        <div>
          <Text className="text-xl font-semibold mr-4">Total Revenue</Text>
          <Text className="text-md text-gray-600">${totalRevenue.toFixed(2)}</Text>
        </div>
      </div>
  
      {/* Revenue Growth */}
      <div className="p-4 rounded-md border border-gray-300 shadow-md bg-white flex items-center space-x-4">
        <TrendingUp className="text-2xl text-blue-500" />
        <div>
          <Text className="text-xl font-semibold mr-4">Revenue Growth (vs. Last Month)</Text>
          <Text className="text-md text-gray-600">${growthFromLastMonth.toFixed(2)} ({growthPercentage}%)</Text>
        </div>
      </div>
  
      {/* Average Order Value */}
      <div className="p-4 rounded-md border border-gray-300 shadow-md bg-white flex items-center space-x-4">
        <DollarSign className="text-2xl text-yellow-500" />
        <div>
          <Text className="text-xl font-semibold mr-4">Average Order Value</Text>
          <Text className="text-md text-gray-600">${averageOrderValue.toFixed(2)}</Text>
        </div>
      </div>
  
      {/* Delivered Revenue */}
      <div className="p-4 rounded-md border border-gray-300 shadow-md bg-white flex items-center space-x-4">
        <CheckCircle className="text-2xl text-green-500" />
        <div>
          <Text className="text-xl font-semibold mr-4">Delivered Revenue</Text>
          <Text className="text-md text-gray-600">${deliveredRevenue.toFixed(2)}</Text>
        </div>
      </div>
  
      {/* Pending Revenue */}
      <div className="p-4 rounded-md border border-gray-300 shadow-md bg-white flex items-center space-x-4">
        <Hourglass className="text-2xl text-orange-500" />
        <div>
          <Text className="text-xl font-semibold mr-4">Pending Revenue</Text>
          <Text className="text-md text-gray-600">${pendingRevenue.toFixed(2)}</Text>
        </div>
      </div>
    </div>
  
    <div id="sales-report">
      <div className="p-6 border shadow-md">
        <Heading className="text-xl font-semibold mb-4">Sales Overview</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={orderChartData} className="text-sm">
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3182CE">
              <LabelList dataKey="total" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
  
      <div className="p-6 border shadow-md mt-5">
        <Heading className="text-xl font-semibold mb-4">Order Status Distribution</Heading>
        <ResponsiveContainer width="100%" height={300} className="flex items-center justify-center gap-x-28">
          <div className="flex justify-center items-center">
            <PieChart width={300} height={300} className="text-sm">
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={120} fill="#8884d8" dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
  
          <div className="text-left">
            {statusPercentages.map((status, index) => (
              <div key={index} className="mb-2 flex items-center">
                <div className="font-semibold mr-2">{status.name}:</div>
                <div>{status.percentage}%</div>
              </div>
            ))}
          </div>
        </ResponsiveContainer>
      </div>
  
      <div className="p-6 border shadow-md mt-5">
        <Heading className="text-xl font-semibold mb-4">Revenue Trend</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dummyOrders}>
            <XAxis dataKey="order_date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total_price" stroke="#82ca9d">
              <LabelList dataKey="total_price" position="top" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
  
      <div className="p-6 border shadow-md mt-5">
        <Heading className="text-xl font-semibold mb-4">Order Details</Heading>
        <div className="mb-4 flex items-center space-x-4 text-sm">
          <input
            type="text"
            placeholder="Search by customer or status"
            className="p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="order_date">Order Date</option>
            <option value="total_price">Total Price</option>
            <option value="status">Status</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-2 text-sm border rounded-md text-gray-600 border-gray-300 hover:text-blue-600 hover:border-blue-600"
          >
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
  
        <div className="overflow-x-auto max-h-[calc(100vh-200px)]">
          <table className="w-full divide-y divide-gray-200 table-fixed border text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} >
                  <td className="border-b px-4 py-2">{order.id}</td>
                  <td className="border-b px-4 py-2">{order.customer}</td>
                  <td className="border-b px-4 py-2">{order.status}</td>
                  <td className="border-b px-4 py-2">${order.total_price.toFixed(2)}</td>
                  <td className="border-b px-4 py-2">{order.order_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="mt-4 flex justify-center space-x-4 text-sm">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm border rounded-md text-gray-600 border-gray-300 hover:text-blue-600 hover:border-blue-600"
          >
            Prev
          </button>
          <span className="px-4 py-2">{currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= sortedOrders.length}
            className="px-4 py-2 text-sm border rounded-md text-gray-600 border-gray-300 hover:text-blue-600 hover:border-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
  
  );
}
