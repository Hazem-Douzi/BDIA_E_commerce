import { useNavigate } from "react-router-dom";
import axios from "axios"
export default function AdminHome() {
  const navigate = useNavigate();
  // Admin button Navigation
  const handle_All_Client_Click = () => {
    navigate("/Home_admin/All_client");
  };
  const handle_All_Seller_Click = () => {
    navigate("/Home_admin/All_seller");
  };
  const handle_All_products_Click = () => {
    navigate("/Home_admin/All_prod");
  };
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };
   const handle_home_click = () => {
    navigate("/Home_admin");
  };
  //--------------------------------------
  return (
    <div className="homepage">
      <header className="header">
        <div className="logo">ShopEase</div>
        <nav>
          <ul>
            <li>
              <a onClick={handle_home_click}>Home</a>
            </li>
            <li>
              <a onClick={handle_All_Client_Click}>All Client</a>
            </li>
            <li>
              <a onClick={handle_All_Seller_Click}>All Seller</a>
            </li>
            <li>
              <a onClick={handle_All_products_Click}>All products</a>
            </li>
            <button onClick={handleLogoutClick} className="login-btn">
              Logout
            </button>
          </ul>
        </nav>
      </header>
      <main className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            Welcome to your Dashboard!
          </h2>
          <p className="text-gray-700 text-lg">
            As an admin, you can manage{" "}
            <span className="font-semibold text-blue-600">clients</span>,{" "}
            <span className="font-semibold text-blue-600">sellers</span>, and{" "}
            <span className="font-semibold text-blue-600">products</span>. Use
            the navigation above to access each section.
          </p>

          {/* Optional: summary cards */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              onClick={handle_All_Client_Click}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                All Clients
              </h3>
              <p className="text-sm text-gray-500">
                View and manage registered clients.
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              onClick={handle_All_Seller_Click}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                All Sellers
              </h3>
              <p className="text-sm text-gray-500">
                Manage seller profiles and activity.
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              onClick={handle_All_products_Click}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                All Products
              </h3>
              <p className="text-sm text-gray-500">
                Approve, edit, or delete products.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
