import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./globals.css";
import SidebarLayout from "@/components/layout/SidebarLayout";
import DashboardPage from "@/app/dashboard/page";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <SidebarLayout />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Sidebar route */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/employees" element={<div>Employees Page</div>} />
            <Route path="/finance" element={<div>Finance Page</div>} />
            <Route path="/sales" element={<div>Sales Page</div>} />
            <Route path="/inventory" element={<div>Inventory Page</div>} />
            <Route path="/products" element={<div>Products Page</div>} />
            <Route path="/settings" element={<div>Settings Page</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// Initialize the app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
