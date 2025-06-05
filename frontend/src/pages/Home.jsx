// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import MapDisplay from '../components/Map';
import SiteCard from '../components/SiteCard';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        console.log('HomePage: Fetching sites from API...');
        
        const response = await api.get('/sites');
        console.log('HomePage: API Response:', response.data);
        
        const sitesData = response.data?.data || [];
        if (!Array.isArray(sitesData)) {
          console.error('HomePage: Invalid sites data received from API:', sitesData);
          throw new Error('Invalid data format received from server');
        }
        
        setSites(sitesData);
        setError(null);
      } catch (err) {
        console.error("HomePage: Failed to fetch sites:", err);
        setError(err.response?.data?.error || err.message || "Could not fetch cultural sites.");
        setSites([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-600">Loading sites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-red-500">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Ensure sites is an array before mapping
  const displaySites = Array.isArray(sites) ? sites : [];
  console.log('HomePage: Display sites:', displaySites);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Explore Chemnitz</h1>
        <p className="text-lg text-gray-600 mt-4">Discover the rich cultural heritage of the city.</p>
      </div>

      <div className="mb-8 rounded-lg shadow-lg overflow-hidden">
        <MapDisplay sites={displaySites} className="h-[500px] md:h-[600px] w-full" />
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Featured Sites</h2>
        {displaySites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySites.slice(0, 6).map((site) => (
              <SiteCard key={site._id} site={site} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No cultural sites found at the moment.</p>
        )}
        {displaySites.length > 6 && (
          <div className="text-center mt-8">
            <Link 
              to="/sites"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition duration-150"
            >
              View All Sites
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
