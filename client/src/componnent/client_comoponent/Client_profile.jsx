import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const ClientProfile = ({handleSelectedClient}) => {
  const navigate = useNavigate();
const [fullName, setFullName] = useState('');
const [email, setEmail] = useState('');
const [age, setAge] = useState('');
const [phoneNumber, setPhoneNumber] = useState('');
const [address, setAddress] = useState('');
const [picture, setPicture] = useState('');

console.log("handleSelectedClient",handleSelectedClient)


useEffect(() => {
  const fetchClientData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const userData = JSON.parse(storedUser);
      const token = localStorage.getItem('token');

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`http://localhost:8080/api/client/${userData.id}`);
      const client = response.data;
      console.log("client", client);

      handleSelectedClient(client); // <- make sure this is defined

setFullName(client.fullName);
setEmail(client.email);
setAge(`${client.age} years old`);
setPhoneNumber(client.phoneNumber);
setAddress(client.address);
setPicture(client.picture);

    } catch (err) {
      console.error('Error fetching client data:', err);
    }
  };

  fetchClientData();
}, [navigate]);


console.log("fullName",fullName)
  const handleMyProducts = () => navigate("/Home_client/Productlist_client");
  const handleProfile = () => navigate("/Profile_client");
  const handleHomeClick = () => {navigate("/Home_client");};
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-600">ShopEase Client</div>
        <nav className="space-x-4">
          <button
            onClick={handleHomeClick}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Home
          </button>
          <button
            onClick={handleMyProducts}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            My Products
          </button>

          <button
            onClick={handleProfile}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Enhanced Client Profile */}
      <div className="client-profile-container">
        <div className="client-profile-card">
          {/* Profile Header */}
          <div className="client-profile-header">
            <h1 className="client-welcome-title">
              Welcome back, {fullName.split(' ')[0] || 'Client'}!
            </h1>
            <p className="client-subtitle">Manage your profile and view your account details</p>
            
            {picture && (
              <div className="client-avatar-container">
                <img
                  src={picture}
                  alt="Profile"
                  className="client-avatar"
                />
                <div className="client-avatar-badge">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="client-profile-content">
            {/* Profile Stats */}
            <div className="client-profile-stats">
              <div className="client-stat-card">
                <div className="client-stat-number">5</div>
                <div className="client-stat-label">Orders</div>
              </div>
              <div className="client-stat-card">
                <div className="client-stat-number">3</div>
                <div className="client-stat-label">Wishlist</div>
              </div>
              <div className="client-stat-card">
                <div className="client-stat-number">4.8</div>
                <div className="client-stat-label">Rating</div>
              </div>
              <div className="client-stat-card">
                <div className="client-stat-number">2</div>
                <div className="client-stat-label">Reviews</div>
              </div>
            </div>

            {/* Profile Progress */}
            <div className="client-profile-progress">
              <div className="client-progress-title">Profile Completion</div>
              <div className="client-progress-bar">
                <div className="client-progress-fill" style={{width: '85%'}}></div>
              </div>
              <div className="client-progress-text">85% Complete</div>
            </div>

            {/* Profile Information Grid */}
            <div className="client-info-grid">
              {/* Personal Information */}
              <div className="client-info-section">
                <h3 className="client-info-section-title">
                  <svg className="client-info-section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h3>
                
                <div className="client-info-item">
                  <svg className="client-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="client-info-content">
                    <div className="client-info-label">Full Name</div>
                    <div className="client-info-value">{fullName}</div>
                  </div>
                </div>
                
                <div className="client-info-item">
                  <svg className="client-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm6-6a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div className="client-info-content">
                    <div className="client-info-label">Age</div>
                    <div className="client-info-value">{age}</div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="client-info-section">
                <h3 className="client-info-section-title">
                  <svg className="client-info-section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information
                </h3>
                
                <div className="client-info-item">
                  <svg className="client-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="client-info-content">
                    <div className="client-info-label">Email</div>
                    <div className="client-info-value">{email}</div>
                  </div>
                </div>
                
                <div className="client-info-item">
                  <svg className="client-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="client-info-content">
                    <div className="client-info-label">Phone</div>
                    <div className="client-info-value">{phoneNumber}</div>
                  </div>
                </div>
                
                <div className="client-info-item">
                  <svg className="client-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="client-info-content">
                    <div className="client-info-label">Address</div>
                    <div className="client-info-value">{address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="client-order-history">
              <h3 className="client-order-history-title">
                <svg className="client-info-section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Recent Orders
              </h3>
              
              <div className="client-order-item">
                <div className="client-order-info">
                  <div className="client-order-id">Order #12345</div>
                  <div className="client-order-date">December 15, 2024</div>
                </div>
                <div className="client-order-status delivered">Delivered</div>
              </div>
              
              <div className="client-order-item">
                <div className="client-order-info">
                  <div className="client-order-id">Order #12344</div>
                  <div className="client-order-date">December 10, 2024</div>
                </div>
                <div className="client-order-status processing">Processing</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="client-profile-actions">
              <button
                onClick={() => navigate("/Profile_client/UpdateClient")}
                className="client-action-btn client-modify-btn"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modify Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
