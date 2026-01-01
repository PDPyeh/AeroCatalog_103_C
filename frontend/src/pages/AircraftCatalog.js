import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aircraftAPI, manufacturerAPI, categoryAPI } from '../api/client';
import { FiSearch } from 'react-icons/fi';

function AircraftCatalog() {
  const [aircraft, setAircraft] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [aircraftRes, manufacturersRes, categoriesRes] = await Promise.all([
          aircraftAPI.getAll({
            manufacturerId: selectedManufacturer || undefined,
            categoryId: selectedCategory || undefined,
            search: searchTerm || undefined,
          }),
          manufacturerAPI.getAll(),
          categoryAPI.getAll(),
        ]);

        setAircraft(aircraftRes.data.data);
        setManufacturers(manufacturersRes.data.data);
        setCategories(categoriesRes.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load aircraft data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedManufacturer, selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-600">Loading catalog...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">AeroCatalog</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search aircraft..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Manufacturer Filter */}
          <select
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Manufacturers</option>
            {manufacturers.map((mfg) => (
              <option key={mfg.id} value={mfg.id}>
                {mfg.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedManufacturer('');
              setSelectedCategory('');
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {/* Aircraft Grid */}
      {aircraft.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aircraft.map((plane) => (
            <Link
              key={plane.id}
              to={`/aircraft/${plane.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="bg-blue-100 h-48 flex items-center justify-center">
                <span className="text-6xl">✈️</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {plane.manufacturer?.name} {plane.modelName}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {plane.description}
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  {plane.maxPassengers && (
                    <p>👥 Passengers: {plane.maxPassengers}</p>
                  )}
                  {plane.cruiseSpeed && (
                    <p>🚀 Cruise Speed: {plane.cruiseSpeed} km/h</p>
                  )}
                  {plane.yearIntroduced && (
                    <p>📅 Introduced: {plane.yearIntroduced}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">No aircraft found</p>
        </div>
      )}
    </div>
  );
}

export default AircraftCatalog;
