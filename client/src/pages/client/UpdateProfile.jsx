import React from "react";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';  
import '../../App.css';


export default function UpdateSeller({selectedClient}) {
  const navigate = useNavigate();
const [fullName, setFullName] = useState(selectedClient?.fullName || "");
const [email, setEmail] = useState(selectedClient?.email || "");
const [phoneNumber, setPhoneNumber] = useState(selectedClient?.phoneNumber || "");
const [address, setAddress] = useState(selectedClient?.address || "");
const [picture, setPicture] = useState(selectedClient?.picture || "");
const [password, setPassword] = useState("")

console.log("selectedClient",selectedClient)

  const saveclient = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = {
        full_name: fullName,
        phone: phoneNumber,
        adress: address,
        email,
      };

      if (password) data.password = password;

      await axios.put(
        "http://127.0.0.1:8080/api/client/profile",
        data,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    saveclient();
    alert("profile updated successfully!");
    navigate("/Profile_client")

  };

  // Navigation
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
    <div>
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

      <div className="update-client-container">
        <div className="update-client-card fade-in-up">
          {/* Header Section */}
          <div className="update-client-header">
            <div className="update-form-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="update-client-title">Update Profile</h1>
            <p className="update-client-subtitle">Keep your information up to date</p>
          </div>

          {/* Form Content */}
          <div className="update-client-content">
            {/* Progress Indicator */}
            <div className="form-progress">
              <div className="form-progress-title">Profile Completion</div>
              <div className="form-progress-bar">
                <div className="form-progress-fill" style={{width: '85%'}}></div>
              </div>
              <div className="form-progress-text">85% Complete</div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="update-form-grid">
                {/* Full Name */}
                <div className="update-form-group">
                  <label className="update-form-label required">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="update-form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="update-form-group">
                  <label className="update-form-label required">
                    Email Address
                  </label>
                  <div className="update-input-container">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="update-form-input"
                      placeholder="Enter your email"
                      required
                    />
                    <svg className="update-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>

                {/* Age */}

                {/* Phone Number */}
                <div className="update-form-group">
                  <label className="update-form-label">
                    Phone Number
                  </label>
                  <div className="update-input-container">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="update-form-input"
                      placeholder="Enter your phone number"
                    />
                    <svg className="update-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>

                {/* Address */}
                <div className="update-form-group full-width">
                  <label className="update-form-label">
                    Address
                  </label>
                  <div className="update-input-container">
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="update-form-input update-form-textarea"
                      placeholder="Enter your complete address"
                      rows="3"
                    />
                    <svg className="update-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="update-form-group full-width">
                  <label className="update-form-label">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    value={picture}
                    onChange={(e) => setPicture(e.target.value)}
                    className="update-form-input"
                    placeholder="Enter profile picture URL"
                  />
                  {picture && (
                    <div className="profile-picture-preview">
                      <img 
                        src={picture} 
                        alt="Profile Preview" 
                        className="profile-picture-thumbnail"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="profile-picture-info">
                        <div className="profile-picture-name">Profile Picture Preview</div>
                        <div className="profile-picture-size">Preview of your profile image</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* New Password */}
                <div className="update-form-group full-width">
                  <label className="update-form-label">
                    New Password (Optional)
                  </label>
                  <div className="password-input-container">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="update-form-input"
                      placeholder="Enter new password (leave blank to keep current)"
                    />
                    <svg className="update-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="update-form-actions">
                <button
                  type="button"
                  onClick={() => navigate("/Profile_client")}
                  className="update-action-btn update-cancel-btn"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="update-action-btn update-save-btn"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
