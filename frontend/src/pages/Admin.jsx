import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Admin = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await api.get('/sites');
      setSites(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSiteImage = async (siteId, imageUrl) => {
    setUpdating(siteId);
    try {
      await api.put(`/sites/${siteId}`, { imageUrl });
      setSites(sites.map(site => 
        site._id === siteId ? { ...site, imageUrl } : site
      ));
      alert('Image updated successfully!');
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Error updating image');
    } finally {
      setUpdating(null);
    }
  };

  const handleImageSubmit = (e, siteId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageUrl = formData.get('imageUrl');
    if (imageUrl) {
      updateSiteImage(siteId, imageUrl);
      e.target.reset();
    }
  };

  if (loading) return <div className="p-8">Loading sites...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin - Manage Site Images</h1>
      
      <div className="space-y-6">
        {sites.map(site => (
          <div key={site._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={site.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={site.name}
                  className="w-full h-48 object-cover rounded"
                />
              </div>
              
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">{site.name}</h3>
                <p className="text-gray-600 mb-4">{site.category}</p>
                
                <form onSubmit={(e) => handleImageSubmit(e, site._id)} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL:</label>
                    <input
                      type="url"
                      name="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      defaultValue={site.imageUrl || ''}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={updating === site._id}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updating === site._id ? 'Updating...' : 'Update Image'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin; 