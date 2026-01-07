import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8080/api/admin/users/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      alert("Error fetching clients. Please check your authentication.");
    }
  };

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

  const handleDeleteClient = async (clientId) => {
    if (confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(`http://127.0.0.1:8080/api/admin/users/${clientId}`);
        alert("Client deleted successfully");
        fetchClients();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Error deleting client: " + (error.response?.data?.message || error.message));
      }
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
                <th className="text-left py-3 px-6">ID</th>
                <th className="text-left py-3 px-6">Full Name</th>
                <th className="text-left py-3 px-6">Email</th>
                <th className="text-left py-3 px-6">Phone</th>
                <th className="text-left py-3 px-6">Address</th>
                <th className="text-left py-3 px-6">Created At</th>
                <th className="text-left py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-semibold text-gray-700">
                    {client.id_user}
                  </td>
                  <td className="py-3 px-6 font-semibold text-gray-700">
                    {client.full_name}
                  </td>
                  <td className="py-3 px-6 text-gray-600">{client.email}</td>
                  <td className="py-3 px-6 text-gray-600">
                    {client.phone || "N/A"}
                  </td>
                  <td className="py-3 px-6 text-gray-600">
                    {client.adress || "N/A"}
                  </td>
                  <td className="py-3 px-6 text-gray-600">
                    {client.createdAT ? new Date(client.createdAT).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleDeleteClient(client.id_user)}
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
                    No clients found.
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
