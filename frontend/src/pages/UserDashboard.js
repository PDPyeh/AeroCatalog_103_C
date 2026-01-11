import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { FiCopy, FiTrash2, FiPlus, FiKey, FiBook, FiLogOut } from 'react-icons/fi';

function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDocs, setShowDocs] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api-keys`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApiKeys(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api-keys/generate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setSuccess('API Key generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchApiKeys();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate API key');
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id) => {
    if (!window.confirm('Are you sure you want to delete this API key?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api-keys/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('API Key deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchApiKeys();
    } catch (err) {
      setError('Failed to delete API key');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('API Key copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const apiLimit = apiKeys.find((k) => k.activeCount !== undefined)?.maxLimit || 10;
  const activeCount = apiKeys.filter((k) => k.isActive).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Alert Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* API Keys Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Your API Keys</h2>
                  <p className="text-gray-600 text-sm">
                    {activeCount} / {apiLimit} keys used
                  </p>
                </div>
                <button
                  onClick={generateApiKey}
                  disabled={loading || activeCount >= apiLimit}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  <FiPlus /> Generate New Key
                </button>
              </div>

              {loading && apiKeys.length === 0 ? (
                <p className="text-gray-600">Loading...</p>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-12">
                  <FiKey className="mx-auto text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">No API keys yet</p>
                  <button
                    onClick={generateApiKey}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Generate Your First API Key
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                              {key.key}
                            </code>
                            <button
                              onClick={() => copyToClipboard(key.key)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Copy to clipboard"
                            >
                              <FiCopy size={18} />
                            </button>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                            {key.lastUsed && (
                              <span className="ml-4">
                                Last used: {new Date(key.lastUsed).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteApiKey(key.id)}
                          className="ml-4 text-red-600 hover:text-red-800"
                          title="Delete API key"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Account Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                {user?.company && (
                  <div>
                    <p className="text-gray-600">Company</p>
                    <p className="font-medium">{user.company}</p>
                  </div>
                )}
                {user?.website && (
                  <div>
                    <p className="text-gray-600">Website</p>
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* API Documentation */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiBook /> API Documentation
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-800 mb-2">Base URL:</p>
                  <code className="bg-gray-100 px-2 py-1 rounded block">
                    {process.env.REACT_APP_API_URL || 'http://localhost:5000'}
                  </code>
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-2">Endpoints:</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• GET /aircraft</li>
                    <li>• GET /aircraft/:id</li>
                    <li>• GET /manufacturers</li>
                    <li>• GET /categories</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-2">Authentication:</p>
                  <p className="text-gray-600">
                    Include header:<br />
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      x-api-key: YOUR_API_KEY
                    </code>
                  </p>
                </div>
                <button
                  onClick={() => setShowDocs(!showDocs)}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showDocs ? 'Hide' : 'Show'} Example Code
                </button>
                {showDocs && (
                  <div className="mt-3">
                    <p className="font-medium text-gray-800 mb-2">Example (JavaScript):</p>
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`fetch('${process.env.REACT_APP_API_URL}/api/aircraft', {
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  }
})
.then(res => res.json())
.then(data => console.log(data));`}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
