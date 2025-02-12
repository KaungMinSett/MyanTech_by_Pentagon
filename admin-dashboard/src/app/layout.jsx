import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import "./globals.css";

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
import EmployeesPage from "@/app/employees/page";

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

          {/* Sales Routes */}
          <Route
            path="/sales/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route index element={<Navigate to="orders" replace />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="orders/:id" element={<OrderDetailPage />} />
                  <Route path="history" element={<OrderHistoryPage />} />
                  <Route path="products" element={<div>Products Page</div>} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Other Protected Routes */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance"
            element={
              <ProtectedRoute>
                <div>Finance Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <div>Inventory Page</div>
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
        </Routes>
        </div>
      </main>
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