import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { aircraftAPI } from '../api/client';

function AircraftDetail() {
  const { id } = useParams();
  const [aircraft, setAircraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAircraft = async () => {
      try {
        setLoading(true);
        const response = await aircraftAPI.getById(id);
        setAircraft(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load aircraft details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAircraft();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-600">Loading aircraft details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!aircraft) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-600">Aircraft not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-8">
          <h1 className="text-4xl font-bold mb-2">
            {aircraft.manufacturer?.name} {aircraft.modelName}
          </h1>
          <p className="text-blue-100">
            Category: {aircraft.category?.name}
          </p>
        </div>

        <div className="p-8">
          {/* Main Image Section */}
          <div className="bg-blue-50 rounded-lg p-12 mb-8 text-center">
            <span className="text-9xl">✈️</span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {aircraft.description}
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aircraft.yearIntroduced && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Year Introduced</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aircraft.yearIntroduced}
                  </p>
                </div>
              )}

              {aircraft.maxPassengers && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Max Passengers</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aircraft.maxPassengers}
                  </p>
                </div>
              )}

              {aircraft.cruiseSpeed && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Cruise Speed</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aircraft.cruiseSpeed} km/h
                  </p>
                </div>
              )}

              {aircraft.maxAltitude && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Max Altitude</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aircraft.maxAltitude} ft
                  </p>
                </div>
              )}

              {aircraft.wingspan && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Wingspan</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aircraft.wingspan} m
                  </p>
                </div>
              )}

              {aircraft.length && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Length</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aircraft.length} m
                  </p>
                </div>
              )}

              {aircraft.maxTakeoffWeight && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Max Takeoff Weight</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aircraft.maxTakeoffWeight} kg
                  </p>
                </div>
              )}

              {aircraft.engines && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Engines</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aircraft.engines}
                  </p>
                </div>
              )}

              {aircraft.engineType && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Engine Type</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aircraft.engineType}
                  </p>
                </div>
              )}

              {aircraft.range && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Range</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aircraft.range} km
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <h3 className="font-bold text-blue-600 mb-2">About {aircraft.manufacturer?.name}</h3>
            <p className="text-gray-700">
              {aircraft.manufacturer?.description || 'Leading aircraft manufacturer'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AircraftDetail;
