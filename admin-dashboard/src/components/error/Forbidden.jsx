import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-2xl text-gray-600 mb-4">Access Denied</p>
        <p className="text-lg text-gray-500 max-w-md mx-auto mb-8">
          You don't have permission to access this page. Please contact your
          administrator if you think this is a mistake.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
