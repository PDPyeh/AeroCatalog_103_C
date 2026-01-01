import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiKeyAPI, aircraftAPI, manufacturerAPI, categoryAPI } from '../api/client';
import { FiCopy, FiTrash2 } from 'react-icons/fi';

function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('api-keys');
  const [apiKeys, setApiKeys] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newGeneratedKey, setNewGeneratedKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [keysRes, aircraftRes, mfgRes, catRes] = await Promise.all([
        apiKeyAPI.getAll(),
        aircraftAPI.getAll({}),
        manufacturerAPI.getAll(),
        categoryAPI.getAll(),
      ]);

      setApiKeys(keysRes.data.data);
      setAircraft(aircraftRes.data.data);
      setManufacturers(mfgRes.data.data);
      setCategories(catRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateApiKey = async () => {
    if (!newKeyName.trim()) {
      alert('Please enter a name for the API key');
      return;
    }

    try {
      const response = await apiKeyAPI.generate({ name: newKeyName });
      setNewGeneratedKey(response.data.data);
      setNewKeyName('');
    } catch (error) {
      console.error('Failed to generate API key:', error);
      alert('Failed to generate API key');
    }
  };

  const handleRevokeApiKey = async (keyId) => {
    if (window.confirm('Are you sure you want to revoke this API key?')) {
      try {
        await apiKeyAPI.revoke(keyId);
        setApiKeys(apiKeys.filter((k) => k.id !== keyId));
      } catch (error) {
        console.error('Failed to revoke API key:', error);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('API key copied to clipboard!');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <p className="text-gray-700">Welcome, <strong>{user?.name}</strong></p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('api-keys')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'api-keys'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              API Keys
            </button>
            <button
              onClick={() => setActiveTab('aircraft')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'aircraft'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Aircraft ({aircraft.length})
            </button>
            <button
              onClick={() => setActiveTab('manufacturers')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'manufacturers'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Manufacturers ({manufacturers.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'categories'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Categories ({categories.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* API Keys Tab */}
            {activeTab === 'api-keys' && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  API Keys
                </h2>

                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-4">
                    Generate an API key to authenticate CRUD requests for aircraft data.
                  </p>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="API Key Name (e.g., 'My App')"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={handleGenerateApiKey}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* New Key Display */}
                {newGeneratedKey && (
                  <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-bold text-green-800 mb-4">
                      API Key Generated Successfully!
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Save this key now. You won't be able to see it again!
                    </p>
                    <div className="flex items-center gap-2 bg-white p-3 rounded border border-green-200">
                      <code className="flex-1 text-sm font-mono">
                        {newGeneratedKey.key}
                      </code>
                      <button
                        onClick={() => copyToClipboard(newGeneratedKey.key)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <FiCopy size={20} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Use this key in the X-API-Key header for all API requests
                    </p>
                  </div>
                )}

                {/* API Keys List */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4">
                    Your API Keys ({apiKeys.length})
                  </h3>
                  {apiKeys.length > 0 ? (
                    <div className="space-y-3">
                      {apiKeys.map((key) => (
                        <div
                          key={key.id}
                          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {key.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(key.createdAt).toLocaleDateString()}
                              {key.lastUsed && (
                                <>
                                  {' | Last used: '}
                                  {new Date(key.lastUsed).toLocaleString()}
                                </>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRevokeApiKey(key.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No API keys yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Aircraft Tab */}
            {activeTab === 'aircraft' && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Aircraft Management
                </h2>
                <p className="text-gray-600 mb-4">
                  Total aircraft: <strong>{aircraft.length}</strong>
                </p>
                <p className="text-sm text-blue-600 mb-6">
                  Use your API key to add, update, or delete aircraft via the API.
                </p>

                {aircraft.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Manufacturer</th>
                          <th className="px-4 py-2 text-left">Model</th>
                          <th className="px-4 py-2 text-left">Category</th>
                          <th className="px-4 py-2 text-left">Passengers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aircraft.map((plane) => (
                          <tr key={plane.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                              {plane.manufacturer?.name}
                            </td>
                            <td className="px-4 py-3">{plane.modelName}</td>
                            <td className="px-4 py-3">
                              {plane.category?.name}
                            </td>
                            <td className="px-4 py-3">
                              {plane.maxPassengers || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Manufacturers Tab */}
            {activeTab === 'manufacturers' && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Manufacturers
                </h2>
                <p className="text-gray-600 mb-4">
                  Total manufacturers: <strong>{manufacturers.length}</strong>
                </p>
                {manufacturers.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {manufacturers.map((mfg) => (
                      <div
                        key={mfg.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <h3 className="font-bold text-gray-800">
                          {mfg.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {mfg.country}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Aircraft: {mfg.aircraft?.length || 0}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Categories
                </h2>
                <p className="text-gray-600 mb-4">
                  Total categories: <strong>{categories.length}</strong>
                </p>
                {categories.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <h3 className="font-bold text-gray-800">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-2">
                          Aircraft: {cat.aircraft?.length || 0}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
