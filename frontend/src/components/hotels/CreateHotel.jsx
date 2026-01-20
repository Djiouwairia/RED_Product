import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import api from '../../api/api';

const CreateHotel = ({ token, onSuccess }) => {
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    email: '',
    telephone: '',
    prix_par_nuit: '',
    devise: 'XOF',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (image) {
      data.append('image', image);
    }
    
    try {
      await api.createHotel(token, data);
      onSuccess();
    } catch (err) {
      setError('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">CRÉER UN NOUVEAU HÔTEL</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de l'hôtel</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Adresse</label>
            <input
              type="text"
              value={formData.adresse}
              onChange={(e) => handleChange('adresse', e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Prix par nuit</label>
            <input
              type="number"
              value={formData.prix_par_nuit}
              onChange={(e) => handleChange('prix_par_nuit', e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Devise</label>
            <select
              value={formData.devise}
              onChange={(e) => handleChange('devise', e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="XOF">F XOF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Ajouter une photo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer text-gray-600">
              {image ? image.name : 'Ajouter une photo'}
            </label>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full md:w-auto px-8 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
};

export default CreateHotel;