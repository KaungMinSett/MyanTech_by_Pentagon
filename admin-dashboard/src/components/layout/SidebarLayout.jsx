import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  Boxes,
  Settings,
  LogOut,
} from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
  { name: "Inventory", href: "/inventory", icon: Boxes },
  { name: "Products", href: "/products", icon: Package },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function SidebarLayout() {
  const pathname = window.location.pathname

  return (
    <div className="bg-white border-r border-gray-200 w-64">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <Link to="/" className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold">MyanTech</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
                <Link
                key={item.name}
                to={item.href}
                className={cn(
                    "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors",
                    isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-700 hover:bg-gray-50"
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
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-200 p-4">
          <button
            className="flex w-full items-center p-2 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}