import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./globals.css";
import SidebarLayout from "@/components/layout/SidebarLayout";
import DashboardPage from "@/app/dashboard/page";
import { AdminLoginPage } from "../components/auth/login";
import EmployeesPage from "./employees/page";


function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex h-screen">

      {!isLoginPage && <SidebarLayout />}
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeesPage/>} />
          <Route path="/finance" element={<div>Finance Page</div>} />
          <Route path="/sales" element={<div>Sales Page</div>} />
          <Route path="/inventory" element={<div>Inventory Page</div>} />
          <Route path="/products" element={<div>Products Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

// Initialize the app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
