import React, { useState, useEffect } from 'react';
import { Camera, LogOut, User, Home, Plus, Search, Mail, Lock, Send, Inbox, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

// Service API
const api = {
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Identifiants incorrects');
    return res.json();
  },
  
  getHotels: async (token, search = '') => {
    const url = search ? `${API_URL}/hotels/?search=${search}` : `${API_URL}/hotels/`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },
  
  createHotel: async (token, formData) => {
    const res = await fetch(`${API_URL}/hotels/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  getDashboardStats: async (token) => {
    const res = await fetch(`${API_URL}/auth/dashboard/stats/`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des statistiques');
    return res.json();
  },
  
  // Messages API
  getMessages: async (token, type = 'all') => {
    const url = `${API_URL}/messages/?type=${type}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },
  
  sendMessage: async (token, data) => {
    const res = await fetch(`${API_URL}/messages/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  markMessageAsRead: async (token, messageId) => {
    const res = await fetch(`${API_URL}/messages/${messageId}/marquer_lu/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },
  
  deleteMessage: async (token, messageId) => {
    const res = await fetch(`${API_URL}/messages/${messageId}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.ok;
  },
  
  getUsers: async (token) => {
    const res = await fetch(`${API_URL}/auth/users/`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },
};

// Composant Login
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

// Composant Messages
const MessagesPage = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [filter]);

 const loadMessages = async () => {
  setLoading(true);
  try {
    const data = await api.getMessages(token, filter);
    // Vérifier si la donnée est paginée (contient 'results') ou est une liste directe
    const results = data.results || data;
    
    // S'assurer que results est bien un tableau avant de mettre à jour le state
    setMessages(Array.isArray(results) ? results : []);
  } catch (err) {
    console.error("Erreur lors du chargement des messages:", err);
    setMessages([]); // Évite que l'application plante
  } finally {
    setLoading(false);
  }
};

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    if (!message.est_lu && filter === 'received') {
      await api.markMessageAsRead(token, message.id);
      loadMessages();
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce message?')) {
      try {
        await api.deleteMessage(token, messageId);
        setSelectedMessage(null);
        loadMessages();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <button
          onClick={() => setShowNewMessage(true)}
          className="flex items-center px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          <Send className="w-5 h-5 mr-2" />
          Nouveau message
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
        >
          Tous
        </button>
        <button
          onClick={() => setFilter('received')}
          className={`px-4 py-2 rounded ${filter === 'received' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
        >
          <Inbox className="w-4 h-4 inline mr-1" />
          Reçus
        </button>
        <button
          onClick={() => setFilter('sent')}
          className={`px-4 py-2 rounded ${filter === 'sent' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
        >
          <Send className="w-4 h-4 inline mr-1" />
          Envoyés
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Aucun message</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleMessageClick(msg)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    !msg.est_lu && filter === 'received' ? 'bg-blue-50' : ''
                  } ${selectedMessage?.id === msg.id ? 'bg-gray-100' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-sm">
                      {filter === 'sent' ? msg.destinataire_nom : msg.expediteur_nom}
                    </p>
                    {!msg.est_lu && filter === 'received' && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 font-medium truncate">{msg.sujet}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.date_envoi).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          {showNewMessage ? (
            <NewMessageForm
              token={token}
              onCancel={() => setShowNewMessage(false)}
              onSuccess={() => {
                setShowNewMessage(false);
                setFilter('sent');
                loadMessages();
              }}
            />
          ) : selectedMessage ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">{selectedMessage.sujet}</h2>
                  <p className="text-sm text-gray-600">
                    De: {selectedMessage.expediteur_nom} | À: {selectedMessage.destinataire_nom}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(selectedMessage.date_envoi).toLocaleString('fr-FR')}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{selectedMessage.contenu || 'Contenu du message...'}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Sélectionnez un message pour le lire
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant Nouveau Message
const NewMessageForm = ({ token, onCancel, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    destinataire_id: '',
    sujet: '',
    contenu: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  // Dans le composant NewMessageForm
const loadUsers = async () => {
  try {
    const data = await api.getUsers(token);
    // On extrait 'results' si Django renvoie une réponse paginée, 
    // sinon on garde 'data' s'il s'agit d'une liste simple
    const userList = data.results || data;
    
    // On s'assure que c'est un tableau avant de mettre à jour le state
    setUsers(Array.isArray(userList) ? userList : []);
  } catch (err) {
    console.error("Erreur lors du chargement des utilisateurs:", err);
    setUsers([]); // Évite le crash au rendu
  }
};
  const handleSubmit = async () => {
    if (!formData.destinataire_id || !formData.sujet || !formData.contenu) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.sendMessage(token, {
        destinataire_id: parseInt(formData.destinataire_id),
        sujet: formData.sujet,
        contenu: formData.contenu,
      });
      onSuccess();
    } catch (err) {
      setError('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Nouveau message</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Destinataire</label>
          <select
            value={formData.destinataire_id}
            onChange={(e) => setFormData({ ...formData, destinataire_id: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Sélectionner un destinataire</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sujet</label>
          <input
            type="text"
            value={formData.sujet}
            onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Sujet du message"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea
            value={formData.contenu}
            onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            rows="6"
            placeholder="Votre message..."
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Register
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
    
    try {
      await api.register(formData);
      setSuccess(true);
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (err) {
      setError('Erreur lors de l\'inscription');
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

// Composant Forgot Password
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

// Composant Dashboard
const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getDashboardStats(token);
      setStats(data);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des statistiques...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const statsCards = [
    { 
      icon: '👥', 
      title: `${stats?.formulaires?.total || 0} Formulaires`, 
      subtitle: stats?.formulaires?.subtitle || 'Inscriptions d\'utilisateurs', 
      color: 'bg-purple-500' 
    },
    { 
      icon: '💬', 
      title: `${stats?.messages?.total || 0} Messages`, 
      subtitle: stats?.messages?.subtitle || 'Fonctionnalité à venir', 
      color: 'bg-teal-500' 
    },
    { 
      icon: '👤', 
      title: `${stats?.utilisateurs?.total || 0} Utilisateurs`, 
      subtitle: stats?.utilisateurs?.subtitle || 'Utilisateurs enregistrés', 
      color: 'bg-yellow-500' 
    },
    { 
      icon: '📧', 
      title: `${stats?.emails?.total || 0} E-mails`, 
      subtitle: stats?.emails?.subtitle || 'E-mails enregistrés', 
      color: 'bg-red-500' 
    },
    { 
      icon: '🏨', 
      title: `${stats?.hotels?.total || 0} Hôtels`, 
      subtitle: stats?.hotels?.subtitle || 'Hôtels enregistrés', 
      color: 'bg-purple-500' 
    },
    { 
      icon: '📊', 
      title: `${stats?.endes?.total || 0} Endes`, 
      subtitle: stats?.endes?.subtitle || 'Hôtels créés', 
      color: 'bg-blue-600' 
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Bienvenue sur RED Product</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">{stat.title}</h3>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistiques détaillées des hôtels */}
      {stats?.hotels && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Statistiques des Hôtels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Hôtels en XOF</p>
              <p className="text-2xl font-bold text-blue-600">{stats.hotels.par_devise.XOF}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Hôtels en EUR</p>
              <p className="text-2xl font-bold text-green-600">{stats.hotels.par_devise.EUR}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Hôtels en USD</p>
              <p className="text-2xl font-bold text-purple-600">{stats.hotels.par_devise.USD}</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Prix moyen par nuit</p>
            <p className="text-2xl font-bold text-gray-800">{stats.hotels.prix_moyen.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Top contributeurs (si admin) */}
      {stats?.top_contributors && stats.top_contributors.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Top Contributeurs</h2>
          <div className="space-y-3">
            {stats.top_contributors.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{user.hotels_count}</p>
                  <p className="text-xs text-gray-500">hôtels</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant Hotels List
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

// Composant Create Hotel
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

// Composant Principal
const App = () => {
  const [page, setPage] = useState('login');
  const [token, setToken] = useState(null);

  const handleLogin = (accessToken) => {
    setToken(accessToken);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setPage('login');
  };

  // Pages d'authentification
  if (page === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToRegister={() => setPage('register')}
        onForgotPassword={() => setPage('forgot')}
      />
    );
  }

  if (page === 'register') {
    return <RegisterPage onSwitchToLogin={() => setPage('login')} />;
  }

  if (page === 'forgot') {
    return <ForgotPasswordPage onBack={() => setPage('login')} />;
  }

  // Pages protégées avec sidebar
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 flex-1">
          <div className="flex items-center mb-8">
            <Home className="w-6 h-6 mr-2" />
            <span className="text-xl font-bold">RED PRODUCT</span>
          </div>
          
          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-2">Principal</p>
            <button
              onClick={() => setPage('dashboard')}
              className={`w-full text-left px-4 py-2 rounded mb-2 ${
                page === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setPage('hotels')}
              className={`w-full text-left px-4 py-2 rounded mb-2 ${
                page === 'hotels' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Liste des hôtels
            </button>
            <button
              onClick={() => setPage('messages')}
              className={`w-full text-left px-4 py-2 rounded ${
                page === 'messages' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Messages
            </button>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-gray-400">En ligne</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {page === 'dashboard' ? 'Dashboard' : page === 'hotels' ? 'Liste des hôtels' : page === 'messages' ? 'Messages' : 'Créer un hôtel'}
          </h2>
          {page === 'hotels' && (
            <button
              onClick={() => setPage('create-hotel')}
              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer un nouveau hôtel
            </button>
          )}
        </div>
        
        {page === 'dashboard' && <Dashboard token={token} />}
        {page === 'hotels' && <HotelsList token={token} />}
        {page === 'messages' && <MessagesPage token={token} />}
        {page === 'create-hotel' && (
          <CreateHotel token={token} onSuccess={() => setPage('hotels')} />
        )}
      </div>
    </div>
  );
};

export default App;