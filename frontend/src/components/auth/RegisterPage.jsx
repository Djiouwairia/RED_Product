import React, { useState } from 'react';
import { Home } from 'lucide-react';
import api from '../../api/api';

const RegisterPage = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
  setLoading(true);
  setError('');
  
  if (!formData.acceptTerms) {
    setError('Veuillez accepter les termes et conditions');
    setLoading(false);
    return;
  }

  // On prépare l'objet avec TOUS les champs attendus par Django
  // Y compris password2 qui semble être requis par ton Serializer
  const dataToSend = {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    password2: formData.password2, // CE CHAMP EST REQUIS PAR TON BACKEND
    first_name: formData.first_name,
    last_name: formData.last_name
  };
  
  try {
    await api.register(dataToSend);
    setSuccess(true);
    setTimeout(() => onSwitchToLogin(), 2000);
  } catch (err) {
    // On affiche l'erreur propre venant de Django
    try {
      const detailedError = JSON.parse(err.message);
      // On extrait le premier message d'erreur (ex: pour password2)
      const field = Object.keys(detailedError)[0];
      const message = detailedError[field][0];
      setError(`${field}: ${message}`);
    } catch (e) {
      setError('Erreur lors de l\'inscription');
    }
  } finally {
    setLoading(false);
  }
};

  if (success) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Inscription réussie!</h2>
          <p>Redirection vers la connexion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <Home className="w-6 h-6 text-gray-800 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">RED PRODUCT</h1>
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-8">Inscrivez-vous en tant que Admin</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                value={formData.password2}
                onChange={(e) => handleChange('password2', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                className="w-4 h-4 text-gray-800 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Accepter les termes et la politique</label>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Vous avez déjà un compte? </span>
            <button onClick={onSwitchToLogin} className="text-yellow-600 hover:underline text-sm">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;