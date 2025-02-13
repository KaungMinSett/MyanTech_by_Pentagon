import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Forbidden from "@/components/error/Forbidden";

const checkAuthorization = (user, pathname) => {
  if (!user) return false;

  // Admin has access to everything
  if (user.department === "Admin") return true;

  // Route-based authorization rules
  switch (true) {
    // Employees page - only Admin and HR
    case pathname.startsWith("/employees"):
      return ["Admin", "HR"].includes(user.department);

    // Finance page - only Admin and Finance department
    case pathname.startsWith("/finance"):
      return ["Admin", "Finance"].includes(user.department);

    // Sales routes - only Admin and Sales department
    case pathname.startsWith("/sales"):
      return ["Admin", "Sales"].includes(user.department);

    // Warehouse routes
    case pathname.startsWith("/warehouse"):
      // Special case for confirm-products - only Warehouse Manager
      if (pathname.includes("confirm-products")) {
        return user.department === "Warehouse" && user.role === "Manager";
      }
      // Other warehouse routes - any Warehouse staff
      return ["Admin", "Warehouse"].includes(user.department);

    // Dashboard and Settings are accessible to everyone
    case pathname === "/dashboard":
    case pathname === "/settings":
      return true;

    default:
      return false;
  }
};

export function ProtectedRoute({ children }) {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // First check authentication
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Then check authorization
  if (!checkAuthorization(user, location.pathname)) {
    return <Forbidden />;
  }

  return children;
}
