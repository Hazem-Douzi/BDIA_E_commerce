import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';

export default function SellerList() {
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [sellers, setSellers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8080/api/admin/users/sellers");
      setSellers(res.data);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      showError("Error fetching sellers. Please check your authentication.", "Erreur de chargement");
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

  const handleDeleteSeller = async (sellerId) => {
    if (confirm("Are you sure you want to delete this seller?")) {
      try {
        await axios.delete(`http://127.0.0.1:8080/api/admin/users/${sellerId}`);
        showSuccess("Seller deleted successfully", "Vendeur supprimé");
        fetchSellers();
      } catch (error) {
        console.error("Delete error:", error);
        showError("Error deleting seller: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleVerifySeller = async (sellerId, status) => {
    try {
      await axios.put(`http://127.0.0.1:8080/api/admin/sellers/${sellerId}/verification`, {
        verification_status: status
      });
      showSuccess(`Seller verification status updated to ${status}`, "Statut mis à jour");
      fetchSellers();
    } catch (error) {
      console.error("Verification error:", error);
      showError("Error updating verification status: " + (error.response?.data?.message || error.message));
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
          All Sellers
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-2xl overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="text-left py-3 px-6">ID</th>
                <th className="text-left py-3 px-6">Full Name</th>
                <th className="text-left py-3 px-6">Email</th>
                <th className="text-left py-3 px-6">Phone</th>
                <th className="text-left py-3 px-6">Shop Name</th>
                <th className="text-left py-3 px-6">Verification</th>
                <th className="text-left py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-semibold text-gray-700">
                    {seller.id_user}
                  </td>
                  <td className="py-3 px-6 font-semibold text-gray-700">
                    {seller.full_name}
                  </td>
                  <td className="py-3 px-6 text-gray-600">{seller.email}</td>
                  <td className="py-3 px-6 text-gray-600">
                    {seller.phone || "N/A"}
                  </td>
                  <td className="py-3 px-6 text-gray-600">
                    {seller.seller_profile?.shop_name || "N/A"}
                  </td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      seller.seller_profile?.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                      seller.seller_profile?.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {seller.seller_profile?.verification_status || 'pending'}
                    </span>
                  </td>
                  <td className="py-3 px-6 flex gap-2">
                    {seller.seller_profile?.verification_status !== 'verified' && (
                      <button
                        onClick={() => handleVerifySeller(seller.id_user, 'verified')}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Verify
                      </button>
                    )}
                    {seller.seller_profile?.verification_status !== 'rejected' && (
                      <button
                        onClick={() => handleVerifySeller(seller.id_user, 'rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSeller(seller.id_user)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {sellers.length === 0 && (
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

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}
