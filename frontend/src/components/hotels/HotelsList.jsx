import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../../api/api';

const HotelsList = ({ token }) => {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const data = await api.getHotels(token, search);
      setHotels(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Liste des hôtels</h1>
          <p className="text-gray-600">Hôtels</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadHotels()}
            placeholder="Recherche"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={hotel.image || 'https://via.placeholder.com/300x200'}
              alt={hotel.nom}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{hotel.adresse}</p>
              <h3 className="font-semibold text-lg mb-2">{hotel.nom}</h3>
              <p className="text-sm font-semibold">
                {hotel.prix_par_nuit?.toLocaleString()} {hotel.devise} par nuit
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelsList;