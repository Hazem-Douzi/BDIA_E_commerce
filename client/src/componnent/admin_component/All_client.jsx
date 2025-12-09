import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8080/api/client/All"); // adjust URL as needed
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching sellers:", err);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);

  // Admin button Navigation
  const handle_home_click = () => {
    navigate("/Home_admin");
  };
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
  //--------------------------------------

  const handleDeleteSeller = async (ClientId) => {
    try {
      await axios.delete(`http://127.0.0.1:8080/api/client/Delete/${ClientId}`);
      alert("seller deleted successfully");
      fetchClients();
      navigate("/Home_admin/All_client");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting client");
    }
  };

  return (
    <div>
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

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          All Clients
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-2xl overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="text-left py-3 px-6">Picture</th>
                <th className="text-left py-3 px-6">Full Name</th>
                <th className="text-left py-3 px-6">Email</th>
                <th className="text-left py-3 px-6">Phone</th>
                <th className="text-left py-3 px-6">Age</th>
                <th className="text-left py-3 px-6">Address</th>
                <th className="text-left py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">
                    <img
                      src={client.picture || "/placeholder.jpg"}
                      alt={client.fullName}
                      className="w-14 h-14 object-cover rounded-full border border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-6 font-semibold text-gray-700">
                    {client.fullName}
                  </td>
                  <td className="py-3 px-6 text-gray-600">{client.email}</td>
                  <td className="py-3 px-6 text-gray-600">
                    {client.phoneNumber || "N/A"}
                  </td>
                  <td className="py-3 px-6 text-gray-600">
                    {client.age || "N/A"}
                  </td>
                  <td className="py-3 px-6 text-gray-600">
                    {client.address || "N/A"}
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleDeleteSeller(client.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No sellers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
