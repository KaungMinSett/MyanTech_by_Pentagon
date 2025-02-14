import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import "./globals.css";
import InventoryList from "./warehouse/inventory-list";
import InboundOutbound from "./warehouse/inbound-outbound";
import { Toaster } from "react-hot-toast";
import { Global } from "@emotion/react";
import { toastStyles, toastConfig } from "@/styles/toast";

// Layout Components
import SidebarLayout from "@/components/layout/SidebarLayout";

// Page Components
import DashboardPage from "@/app/dashboard/page";
import { AdminLoginPage } from "@/components/auth/login";
import { OrdersPage } from "@/app/sales/orders/page";
import { OrderDetailPage } from "@/app/sales/orders/order-detail";
import { OrderHistoryPage } from "@/app/sales/history/page";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import StaffList from "./employees/page";
import ConfirmProducts from "./warehouse/confirm-products";
import ProductForm from "./warehouse/inventory-management";
import ProductList from "./sales/products";
import Error404 from "@/components/error/Error404";
import FinanceList from "./finance/page";
import FinanceDetail from "../components/finance/finance-detail";
import SalesReports from "./reports/sale-report";
import { DeliveryPage } from "@/app/delivery/page";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex h-screen">
      {!isLoginPage && <SidebarLayout />}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {!isLoginPage && <Breadcrumb />}
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/report" element={<SalesReports />} />

            {/* Sales Routes */}
            <Route
              path="/sales/*"
              element={
                <Routes>
                  <Route index element={<Navigate to="orders" replace />} />
                  <Route 
                    path="orders" 
                    element={<OrdersPage />} 
                  />
                  <Route 
                    path="orders/:id" 
                    element={<OrderDetailPage />} 
                  />
                  <Route 
                    path="history" 
                    element={<OrderHistoryPage />} 
                  />
                  <Route 
                    path="products" 
                    element={<ProductList />} 
                  />
                </Routes>
              }
            />

            {/* Add Delivery Route */}
            <Route
              path="/delivery"
              element={
                <ProtectedRoute>
                  <DeliveryPage />
                </ProtectedRoute>
              }
            />

            {/* Warehouse Routes */}
            <Route
              path="/warehouse/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="inventory" element={<InventoryList />} />
                    <Route path="in-out" element={<InboundOutbound />} />
                    <Route
                      path="confirm-products"
                      element={<ConfirmProducts />}
                    />
                    <Route path="update" element={<ProductForm />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Other Protected Routes */}
            <Route
              path="/employees/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route index element={<StaffList />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route
              path="/finance/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route index element={<FinanceList />} />
                    <Route path=":id" element={<FinanceDetail />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <div>Settings Page</div>
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </div>
      </main>
      <Global styles={toastStyles} />
      <Toaster position="top-center" toastOptions={toastConfig} />
    </div>
  );
}

// Root Component
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
