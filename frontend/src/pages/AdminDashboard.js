import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { aircraftAPI, manufacturerAPI, categoryAPI } from '../api/client';
import { FiTrash2, FiPlus, FiEdit2 } from 'react-icons/fi';

function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('aircraft');
  const [aircraft, setAircraft] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // CRUD Modal States
  const [showAircraftModal, setShowAircraftModal] = useState(false);
  const [showManufacturerModal, setShowManufacturerModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

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
      const [aircraftRes, mfgRes, catRes] = await Promise.all([
        aircraftAPI.getAll({}),
        manufacturerAPI.getAll(),
        categoryAPI.getAll(),
      ]);

      setAircraft(aircraftRes.data.data);
      setManufacturers(mfgRes.data.data);
      setCategories(catRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Handlers for Manufacturer
  const handleCreateManufacturer = () => {
    setEditingItem(null);
    setFormData({ name: '', country: '', description: '', image: '' });
    setShowManufacturerModal(true);
  };

  const handleEditManufacturer = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowManufacturerModal(true);
  };

  const handleSaveManufacturer = async () => {
    try {
      if (editingItem) {
        await manufacturerAPI.update(editingItem.id, formData);
      } else {
        await manufacturerAPI.create(formData);
      }
      setShowManufacturerModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save manufacturer:', error);
      alert('Failed to save manufacturer');
    }
  };

  const handleDeleteManufacturer = async (id) => {
    if (window.confirm('Are you sure you want to delete this manufacturer?')) {
      try {
        await manufacturerAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete manufacturer:', error);
        alert('Failed to delete manufacturer');
      }
    }
  };

  // CRUD Handlers for Category
  const handleCreateCategory = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (editingItem) {
        await categoryAPI.update(editingItem.id, formData);
      } else {
        await categoryAPI.create(formData);
      }
      setShowCategoryModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Failed to delete category');
      }
    }
  };

  // CRUD Handlers for Aircraft
  const handleCreateAircraft = () => {
    setEditingItem(null);
    setFormData({
      modelName: '',
      manufacturerId: '',
      categoryId: '',
      description: '',
      yearIntroduced: '',
      maxPassengers: '',
      cruiseSpeed: '',
      maxAltitude: '',
      wingspan: '',
      length: '',
      maxTakeoffWeight: '',
      engines: '',
      engineType: '',
      range: '',
      image: '',
      specifications: ''
    });
    setShowAircraftModal(true);
  };

  const handleEditAircraft = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowAircraftModal(true);
  };

  const handleSaveAircraft = async () => {
    try {
      const data = {
        ...formData,
        yearIntroduced: formData.yearIntroduced ? parseInt(formData.yearIntroduced) : null,
        maxPassengers: formData.maxPassengers ? parseInt(formData.maxPassengers) : null,
        cruiseSpeed: formData.cruiseSpeed ? parseFloat(formData.cruiseSpeed) : null,
        maxAltitude: formData.maxAltitude ? parseFloat(formData.maxAltitude) : null,
        wingspan: formData.wingspan ? parseFloat(formData.wingspan) : null,
        length: formData.length ? parseFloat(formData.length) : null,
        maxTakeoffWeight: formData.maxTakeoffWeight ? parseFloat(formData.maxTakeoffWeight) : null,
        engines: formData.engines ? parseInt(formData.engines) : null,
        range: formData.range ? parseFloat(formData.range) : null,
        manufacturerId: parseInt(formData.manufacturerId),
        categoryId: parseInt(formData.categoryId)
      };

      if (editingItem) {
        await aircraftAPI.update(editingItem.id, data);
      } else {
        await aircraftAPI.create(data);
      }
      setShowAircraftModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save aircraft:', error);
      alert('Failed to save aircraft');
    }
  };

  const handleDeleteAircraft = async (id) => {
    if (window.confirm('Are you sure you want to delete this aircraft?')) {
      try {
        await aircraftAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete aircraft:', error);
        alert('Failed to delete aircraft');
      }
    }
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
            {/* Aircraft Tab */}
            {activeTab === 'aircraft' && (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Aircraft Management
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Total aircraft: <strong>{aircraft.length}</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleCreateAircraft}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FiPlus /> Add Aircraft
                  </button>
                </div>

                {aircraft.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Manufacturer</th>
                          <th className="px-4 py-2 text-left">Model</th>
                          <th className="px-4 py-2 text-left">Category</th>
                          <th className="px-4 py-2 text-left">Passengers</th>
                          <th className="px-4 py-2 text-left">Actions</th>
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
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditAircraft(plane)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <FiEdit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteAircraft(plane.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <FiTrash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No aircraft yet. Click "Add Aircraft" to create one.</p>
                )}
              </div>
            )}

            {/* Manufacturers Tab */}
            {activeTab === 'manufacturers' && (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Manufacturers
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Total manufacturers: <strong>{manufacturers.length}</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleCreateManufacturer}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FiPlus /> Add Manufacturer
                  </button>
                </div>
                {manufacturers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {manufacturers.map((mfg) => (
                      <div
                        key={mfg.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditManufacturer(mfg)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteManufacturer(mfg.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No manufacturers yet. Click "Add Manufacturer" to create one.</p>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Categories
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Total categories: <strong>{categories.length}</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleCreateCategory}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FiPlus /> Add Category
                  </button>
                </div>
                {categories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {cat.name}
                            </h3>
                            <p className="text-sm text-gray-600">{cat.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Aircraft: {cat.aircraft?.length || 0}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditCategory(cat)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No categories yet. Click "Add Category" to create one.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Manufacturer Modal */}
      {showManufacturerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Manufacturer' : 'Add Manufacturer'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveManufacturer}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowManufacturerModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Category' : 'Add Category'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveCategory}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aircraft Modal */}
      {showAircraftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Aircraft' : 'Add Aircraft'}
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model Name *
                  </label>
                  <input
                    type="text"
                    value={formData.modelName || ''}
                    onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manufacturer *
                  </label>
                  <select
                    value={formData.manufacturerId || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturerId: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Manufacturer</option>
                    {manufacturers.map(mfg => (
                      <option key={mfg.id} value={mfg.id}>{mfg.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Introduced
                  </label>
                  <input
                    type="number"
                    value={formData.yearIntroduced || ''}
                    onChange={(e) => setFormData({ ...formData, yearIntroduced: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Passengers
                  </label>
                  <input
                    type="number"
                    value={formData.maxPassengers || ''}
                    onChange={(e) => setFormData({ ...formData, maxPassengers: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cruise Speed (km/h)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cruiseSpeed || ''}
                    onChange={(e) => setFormData({ ...formData, cruiseSpeed: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Altitude (ft)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maxAltitude || ''}
                    onChange={(e) => setFormData({ ...formData, maxAltitude: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Range (km)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.range || ''}
                    onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Takeoff Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maxTakeoffWeight || ''}
                    onChange={(e) => setFormData({ ...formData, maxTakeoffWeight: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wingspan (m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.wingspan || ''}
                    onChange={(e) => setFormData({ ...formData, wingspan: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Length (m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.length || ''}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Engines (qty)
                  </label>
                  <input
                    type="number"
                    value={formData.engines || ''}
                    onChange={(e) => setFormData({ ...formData, engines: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Engine Type
                  </label>
                  <input
                    type="text"
                    value={formData.engineType || ''}
                    onChange={(e) => setFormData({ ...formData, engineType: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., Turbofan CFM56-7B24"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specifications (JSON)
                </label>
                <textarea
                  value={formData.specifications || ''}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                  placeholder='{"fuel_capacity": "26000L", "max_speed": "490kt"}'
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveAircraft}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowAircraftModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
