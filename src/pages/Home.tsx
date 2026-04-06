import { useAuth, useCurrentUser } from "../hooks";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { logout } = useAuth();
  const user = useCurrentUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-teal-700">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, {user?.firstName ?? "User"}.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Hello {user?.firstName ?? "there"}!
          </h2>
          <p className="text-gray-600 mb-6">
            This is your simple dashboard. Use the button above to open your
            products page.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 text-left">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-semibold text-gray-900">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : "-"}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-left">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-900 truncate">
                {user?.email ?? "-"}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate("/products")}
              className="w-full sm:w-auto bg-teal-600 text-white px-5 py-3 rounded-lg hover:bg-teal-700 transition cursor-pointer"
            >
              View Products
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
