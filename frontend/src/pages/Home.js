import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-blue-600 mb-6">
          Welcome to AeroCatalog
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Explore a comprehensive catalog of commercial and military aircraft from Boeing and Airbus.
          Discover detailed specifications, dimensions, and performance data for each aircraft.
        </p>
        <Link
          to="/catalog"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
        >
          Browse Catalog
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-lg">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Comprehensive Data
              </h3>
              <p className="text-gray-600">
                Access detailed specifications including dimensions, weight, capacity, and performance metrics.
              </p>
            </div>

            <div className="bg-green-50 p-8 rounded-lg">
              <div className="text-4xl mb-4">✈️</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Major Manufacturers
              </h3>
              <p className="text-gray-600">
                Explore aircraft from Boeing, Airbus, and other leading aviation manufacturers.
              </p>
            </div>

            <div className="bg-purple-50 p-8 rounded-lg">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Easy Management
              </h3>
              <p className="text-gray-600">
                Admin dashboard for managing aircraft information with API key authentication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Explore?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start browsing our comprehensive Aerocatalog or log in as an admin to manage data.
          </p>
          <div className="space-x-4">
            <Link
              to="/catalog"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-block"
            >
              View Catalog
            </Link>
            <Link
              to="/admin/login"
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 transition inline-block"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
