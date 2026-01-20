import React, { useState } from 'react';
import { Mail, Lock, Home } from 'lucide-react';
import api from '../../api/api';

const LoginPage = ({ onLogin, onSwitchToRegister, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await api.login(email, password);
      onLogin(data.access);
    } catch (err) {
      setError('E-mail ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <Home className="w-6 h-6 text-gray-800 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">RED PRODUCT</h1>
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-8">Connectez-vous en tant que Admin</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-gray-800 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Gardez-moi connecté</label>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <button onClick={onForgotPassword} className="text-yellow-600 hover:underline text-sm">
              Mot de passe oublié?
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Vous n'avez pas de compte? </span>
            <button onClick={onSwitchToRegister} className="text-yellow-600 hover:underline text-sm">
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;