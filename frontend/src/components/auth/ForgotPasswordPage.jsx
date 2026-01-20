import React, { useState } from 'react';
import { Home } from 'lucide-react';

const ForgotPasswordPage = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <Home className="w-6 h-6 text-gray-800 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">RED PRODUCT</h1>
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-4">Mot de passe oublié?</h2>
          <p className="text-sm text-gray-600 text-center mb-8">
            Entrez votre adresse e-mail ci-dessous et nous vous envoyons des instructions sur la façon de modifier votre mot de passe.
          </p>
          
          {sent ? (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
              Instructions envoyées! Vérifiez votre e-mail.
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Votre e-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
                />
              </div>
              
              <button
                onClick={() => setSent(true)}
                className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                Envoyer
              </button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button onClick={onBack} className="text-yellow-600 hover:underline text-sm">
              Revenir à la connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;