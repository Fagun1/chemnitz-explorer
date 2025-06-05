import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const SiteCard = ({ site }) => {
  if (!site) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-1 text-gray-800">{site.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{site.category}</p>
        <p className="text-gray-700 text-sm mb-3 truncate">
          {site.description.substring(0, 100)}{site.description.length > 100 && '...'}
        </p>
        <Link to={`/sites/${site._id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
      </div>
    </div>
  );
};

export default SiteCard; 