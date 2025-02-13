import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const getDisplaySegments = () => {
    return pathSegments
      .map((segment, index) => {
        // Skip parent routes
        if (segment === "sales" || segment === "warehouse") {
          return null;
        }

        const specialCases = {
          "in-out": "Inbound/Outbound",
          history: "Order History",
          update: "Update Inventory",
        };

        if (specialCases[segment]) {
          return {
            name: specialCases[segment],
            path: "/" + pathSegments.slice(0, index + 1).join("/"),
          };
        }

        // Default formatting for other segments
        const formattedName = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return {
          name: formattedName,
          path: "/" + pathSegments.slice(0, index + 1).join("/"),
        };
      })
      .filter(Boolean);
  };

  if (location.pathname === "/") return null;

  const displaySegments = getDisplaySegments();

  return (
    <nav className="mb-8">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            <Home className="h-5 w-5" />
          </Link>
        </li>
        {displaySegments.map((segment) => (
          <li key={segment.path} className="flex items-center">
            <ChevronRight className="h-5 w-5 text-gray-300" />
            <Link
              to={segment.path}
              className="ml-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              {segment.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
