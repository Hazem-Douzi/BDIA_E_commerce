import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const SellerHome = ({handleSelectedSeller}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    age: '',
    phoneNumber: '',
    address: '',
    picture: '',
  });

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return navigate('/');

        const userData = JSON.parse(storedUser);
        const token = localStorage.getItem('token');

        if (!token || userData.role !== 'seller') return navigate('/login');

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.get(`http://localhost:8080/api/seller/${userData.id}`);
        const seller = response.data;

        handleSelectedSeller(seller)

        setUser({
          fullName: seller.fullName ,
          email: seller.email ,
          age:  `${seller.age} years old` ,
          phoneNumber: seller.phoneNumber ,
          address: seller.address ,
          picture: seller.picture ,
        });
      } catch (err) {
        console.error('Error fetching seller data:', err);
        navigate('/');
      }
    };

    fetchSellerData();
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600 mb-2 md:mb-0">ShopEase Seller Dashboard</h1>
        <nav className="space-x-2">
          <button onClick={() => navigate('/Home_seller')} className="text-gray-700 hover:text-indigo-600 font-medium">Home</button>
          <button onClick={() => navigate('/Home_seller/my_products')} className="text-gray-700 hover:text-indigo-600 font-medium">My Products</button>
          <button onClick={() => navigate('/Home_seller/add_product')} className="text-gray-700 hover:text-indigo-600 font-medium">Add Product</button>
          <button onClick={() => navigate('/Home_seller/profile')} className="text-gray-700 hover:text-indigo-600 font-medium">Profile</button>
          <button onClick={logout} className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Logout</button>
        </nav>
      </header>

      {/* Seller Profile Card */}
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Welcome back, {user.fullName.split(' ')[0] || 'Seller'}!
        </h2>

        {user.picture && (
          <div className="mb-6 text-center">
            <img
              src={user.picture}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto object-cover shadow"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div className="space-y-3">
            <p><span className="font-semibold">Full Name:</span> {user.fullName}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Phone:</span> {user.phoneNumber}</p>
          </div>
          <div className="space-y-3">
            <p><span className="font-semibold">Age:</span> {user.age}</p>
            <p><span className="font-semibold">Address:</span> {user.address}</p>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={() => navigate("/Home_seller/profile/UpdateSeller")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-md transition"
          >
            Modify Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerHome;
