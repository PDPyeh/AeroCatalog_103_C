import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCode, FiBook, FiZap } from 'react-icons/fi';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            ✈️ AeroCatalog API
          </h1>
          <p className="text-2xl text-gray-700 mb-6">
            Database Pesawat Komersial Terlengkap Indonesia
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Integrasi database pesawat ke aplikasi Anda dengan mudah. 
            API sederhana, dokumentasi lengkap, dan dukungan penuh untuk developers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg"
          >
            <FiArrowRight /> 🎉 Ayo Daftar Sekarang!
          </Link>
          <Link
            to="/help"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2 text-lg"
          >
            <FiBook /> Pelajari API
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Kenapa Memilih AeroCatalog?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-lg border-2 border-blue-200 hover:shadow-lg transition">
              <div className="text-4xl text-blue-600 mb-4">
                <FiCode />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                API Simpel
              </h3>
              <p className="text-gray-600">
                REST API yang mudah digunakan dengan dokumentasi lengkap. 
                Hanya butuh API key untuk mulai mengintegrasikan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-lg border-2 border-green-200 hover:shadow-lg transition">
              <div className="text-4xl text-green-600 mb-4">
                <FiZap />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Data Lengkap
              </h3>
              <p className="text-gray-600">
                63+ pesawat komersial dari 5 manufacturer terkemuka. 
                Spesifikasi lengkap termasuk kapasitas, kecepatan, dan jangkauan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-lg border-2 border-purple-200 hover:shadow-lg transition">
              <div className="text-4xl text-purple-600 mb-4">
                <FiBook />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Support Lengkap
              </h3>
              <p className="text-gray-600">
                Dokumentasi detail, contoh code, dan tool testing API. 
                Tim siap membantu integrasi Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Highlights Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">63+</div>
              <p className="text-xl">Aircraft Models</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5</div>
              <p className="text-xl">Manufacturers</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">6</div>
              <p className="text-xl">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Siap Mengintegrasikan Database Pesawat?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Dapatkan API key gratis dan mulai build aplikasi Anda. 
            Tidak ada kartu kredit diperlukan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
            >
              🎉 Ayo Daftar Sekarang!
            </Link>
            <Link
              to="/help"
              className="bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition text-lg"
            >
              Lihat Dokumentasi
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Examples */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Mudah Diintegrasikan
          </h2>

          <div className="bg-gray-900 text-gray-100 p-8 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`// JavaScript/React Example
const apiKey = 'your_api_key_here';

// Get all aircraft
fetch('http://localhost:5000/api/aircraft', {
  headers: { 'x-api-key': apiKey }
})
.then(res => res.json())
.then(data => console.log(data.data));

// Get specific aircraft
fetch('http://localhost:5000/api/aircraft/1', {
  headers: { 'x-api-key': apiKey }
})
.then(res => res.json())
.then(data => console.log(data.data));`}
            </pre>
          </div>

          <p className="text-center text-gray-600 mt-8">
            Contoh lebih lengkap & tool testing API tersedia di halaman{' '}
            <Link to="/help" className="text-blue-600 font-semibold hover:underline">
              Help & Documentation
            </Link>
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Mulai Sekarang - Gratis!
          </h3>
          <p className="text-gray-300 mb-8 text-lg">
            Daftar dalam hitungan menit dan dapatkan akses API
          </p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
          >
            Daftar & Mulai Coding
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
