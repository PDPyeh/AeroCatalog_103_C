import React, { useState } from 'react';
import { FiCopy, FiPlay } from 'react-icons/fi';

function Help() {
  const [activeTab, setActiveTab] = useState('docs');
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('/api/aircraft');
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const endpoints = [
    { path: '/api/aircraft', method: 'GET', description: 'Get all aircraft' },
    { path: '/api/aircraft/:id', method: 'GET', description: 'Get specific aircraft' },
    { path: '/api/manufacturers', method: 'GET', description: 'Get all manufacturers' },
    { path: '/api/categories', method: 'GET', description: 'Get all categories' },
  ];

  const handleTestAPI = async () => {
    if (!apiKey) {
      setTestResult({ error: 'Silakan masukkan API key Anda terlebih dahulu' });
      return;
    }

    setLoading(true);
    try {
      const url = `http://localhost:5000${endpoint}`;
      const response = await fetch(url, {
        headers: { 'x-api-key': apiKey },
      });

      const data = await response.json();

      if (response.ok) {
        setTestResult({
          success: true,
          status: response.status,
          data: data,
        });
      } else {
        setTestResult({
          error: data.message || 'API Error',
          status: response.status,
        });
      }
    } catch (err) {
      setTestResult({
        error: `Failed to fetch: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Help & Documentation</h1>
          <p className="text-xl text-blue-100">
            Pelajari cara menggunakan AeroCatalog API dan test secara langsung
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'docs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📖 Dokumentasi
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'test'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🧪 Test API
          </button>
        </div>

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <div className="space-y-8 pb-12">
            {/* Getting Started */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🚀 Memulai
              </h2>
              <ol className="space-y-4 text-gray-600">
                <li className="flex gap-4">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Daftar Akun
                    </p>
                    <p>
                      Kunjungi halaman login dan daftar untuk mendapatkan akun Anda
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Generate API Key
                    </p>
                    <p>
                      Buka dashboard dan generate API key (max 10 per akun)
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Mulai Menggunakan
                    </p>
                    <p>
                      Gunakan API key di header request untuk akses database pesawat
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            {/* API Endpoints */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📍 API Endpoints
              </h2>

              <div className="space-y-4">
                {endpoints.map((ep, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start gap-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm font-semibold">
                        {ep.method}
                      </span>
                      <div className="flex-1">
                        <p className="font-mono text-sm bg-gray-100 p-2 rounded mb-2">
                          {ep.path}
                        </p>
                        <p className="text-gray-600">{ep.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Authentication */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔐 Autentikasi
              </h2>
              <p className="text-gray-600 mb-4">
                Semua request harus include header API key:
              </p>

              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`x-api-key: YOUR_API_KEY_HERE`}
                </pre>
              </div>

              <p className="text-gray-600 mt-4 text-sm">
                Dapatkan API key Anda di halaman{' '}
                <span className="font-semibold">User Dashboard</span> setelah login
              </p>
            </section>

            {/* Response Format */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📤 Response Format
              </h2>
              <p className="text-gray-600 mb-4">Semua response dalam format JSON:</p>

              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`{
  "success": true,
  "data": [
    {
      "id": 1,
      "modelName": "Boeing 737-800",
      "maxPassengers": 162,
      "cruiseSpeed": 494,
      "maxAltitude": 11281,
      "wingspan": 35.79,
      "length": 39.5,
      "maxTakeoffWeight": 79000,
      "engines": 2,
      "engineType": "CFM56-7B26",
      "range": 5436,
      "yearIntroduced": 1988,
      "manufacturer": {
        "id": 1,
        "name": "Boeing"
      },
      "category": {
        "id": 1,
        "name": "Narrow Body"
      }
    }
  ]
}`}
                </pre>
              </div>
            </section>

            {/* Code Examples */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                💻 Contoh Code
              </h2>

              <div className="space-y-6">
                {/* JavaScript */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    JavaScript / React
                  </h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
{`const apiKey = 'your_api_key_here';

// Get all aircraft
fetch('http://localhost:5000/api/aircraft', {
  headers: { 'x-api-key': apiKey }
})
.then(res => res.json())
.then(data => {
  console.log('Aircraft:', data.data);
  // Display in your app
});

// Get aircraft by ID
fetch('http://localhost:5000/api/aircraft/1', {
  headers: { 'x-api-key': apiKey }
})
.then(res => res.json())
.then(data => console.log(data.data[0]));`}
                    </pre>
                  </div>
                </div>

                {/* Python */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Python</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
{`import requests

api_key = 'your_api_key_here'
headers = {'x-api-key': api_key}

# Get all aircraft
response = requests.get(
  'http://localhost:5000/api/aircraft',
  headers=headers
)
data = response.json()
print(data['data'])`}
                    </pre>
                  </div>
                </div>

                {/* cURL */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">cURL</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
{`curl -H "x-api-key: your_api_key_here" \\
  http://localhost:5000/api/aircraft`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Test API Tab */}
        {activeTab === 'test' && (
          <div className="bg-white rounded-lg shadow-md p-8 pb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🧪 Test API Anda
            </h2>

            <div className="space-y-6">
              {/* API Key Input */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Masukkan API key Anda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Dapatkan API key di dashboard setelah login
                </p>
              </div>

              {/* Endpoint Select */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Pilih Endpoint
                </label>
                <select
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {endpoints.map((ep) => (
                    <option key={ep.path} value={ep.path}>
                      {ep.method} {ep.path} - {ep.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Button */}
              <button
                onClick={handleTestAPI}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                <FiPlay /> {loading ? 'Testing...' : 'Test Endpoint'}
              </button>

              {/* Results */}
              {testResult && (
                <div
                  className={`p-6 rounded-lg border-2 ${
                    testResult.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      testResult.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {testResult.success ? '✅ Success!' : '❌ Error'}
                  </h3>

                  {testResult.status && (
                    <p className="text-sm text-gray-600 mb-3">
                      Status: <span className="font-mono font-semibold">{testResult.status}</span>
                    </p>
                  )}

                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs">
                      {JSON.stringify(
                        testResult.success ? testResult.data : { error: testResult.error },
                        null,
                        2
                      )}
                    </pre>
                  </div>

                  {testResult.success && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          JSON.stringify(testResult.data, null, 2)
                        );
                      }}
                      className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      <FiCopy /> Copy Response
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Help;
