import {
  LayoutDashboard,
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  Boxes,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/features/auth/auth-slice";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Finance", href: "/finance", icon: DollarSign },
  {
    name: "Sales",
    icon: ShoppingCart,
    children: [
      { name: "Orders", href: "/sales/orders" },
      { name: "Products", href: "/sales/products" },
    ],
  },
  {
    name: "Warehouse",
    icon: Boxes,
    children: [
      { name: "Inventory List", href: "/warehouse/inventory" },
      { name: "Inbound/Outbound", href: "/warehouse/in-out" },
      { name: "Update Inventory", href: "/warehouse/update" },
      { name: "Confirm Products", href: "/warehouse/confirm-products" },
    ],
  },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function SidebarLayout() {
  const pathname = window.location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-white border-r border-gray-200 w-64">
      <div className="flex h-full flex-col">
        {/* Logo section */}
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <Link to="/" className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold">MyanTech</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = item.children ? false : pathname === item.href;

            return (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <div className="flex items-center px-4 py-3 text-base font-medium text-gray-600">
                      <item.icon className="h-6 w-6 text-gray-400" />
                      <span className="ml-4 hover:cursor-pointer">
                        {item.name}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors w-full",
                            pathname === child.href
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <span className="ml-10">{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-6 w-6",
                        isActive ? "text-blue-600" : "text-gray-400"
                      )}
                    />
                    <span className="ml-4">{item.name}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout section */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
