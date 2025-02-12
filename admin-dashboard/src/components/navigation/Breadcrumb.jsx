import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbMap = {
    sales: 'Sales',
    orders: 'Orders',
    history: 'History',
  };

  const handleLastItemClick = (routeTo) => {
    navigate(routeTo, { replace: true });
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-12">
      <Link to="/" className="hover:text-gray-900">
        <Home className="w-4 h-4" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = breadcrumbMap[name] || name;

        return (
          <div key={name} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2" />
            <span
              className={`${isLast ? 'text-gray-900' : ''} ${
                isLast ? 'cursor-pointer hover:text-gray-600' : ''
              }`}
              onClick={isLast ? () => handleLastItemClick(routeTo) : undefined}
            >
              {!isLast ? (
                <Link to={routeTo} className="hover:text-gray-900">
                  {displayName}
                </Link>
              ) : (
                displayName
              )}
            </span>
          </div>
        );
      })}
    </nav>
  );
}