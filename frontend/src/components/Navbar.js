import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FiMenu, FiX } from 'react-icons/fi';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          ✈️ AeroCatalog
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link to="/help" className="hover:text-blue-200">
            Help & Docs
          </Link>
          <Link to="/catalog" className="hover:text-blue-200">
            Catalog
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/user/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
              <Link to="/chatbot" className="hover:text-blue-200">
                Chatbot
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
              Login
            </Link>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-2 space-y-2">
          <Link to="/" className="block hover:text-blue-200">
            Home
          </Link>
          <Link to="/help" className="block hover:text-blue-200">
            Help & Docs
          </Link>
          <Link to="/catalog" className="block hover:text-blue-200">
            Catalog
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/user/dashboard" className="block hover:text-blue-200">
                Dashboard
              </Link>
              <Link to="/chatbot" className="block hover:text-blue-200">
                Chatbot
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="block bg-green-500 px-4 py-2 rounded hover:bg-green-600">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
