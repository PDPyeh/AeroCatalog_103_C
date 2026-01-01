import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Aircraft Catalog</h3>
            <p className="text-gray-400">
              Explore the comprehensive catalog of Boeing and Airbus aircraft with detailed specifications and information.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="text-gray-400 space-y-2">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/catalog" className="hover:text-white">Catalog</a></li>
              <li><a href="/admin/login" className="hover:text-white">Admin Login</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">About</h3>
            <p className="text-gray-400">
              This is an educational project showcasing aircraft information and specifications from major manufacturers.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Aircraft Catalog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
