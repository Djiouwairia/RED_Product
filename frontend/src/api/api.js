const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Nettoyage de l'URL pour éviter les doubles slashs //
const API_URL = VITE_API_URL.endsWith('/') ? VITE_API_URL.slice(0, -1) : VITE_API_URL;

const api = {
  register: async (data) => {
    // Correction : Utilisation du chemin complet api/auth/register/
    const res = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json(); // On tente de récupérer le JSON d'erreur de Django
      throw new Error(JSON.stringify(errorData) || 'Erreur lors de l\'inscription');
    }
    return res.json();
  },
  
  login: async (email, password) => {
    // Correction : Ton urls.py attend 'auth/login/' et non 'token/'
    const res = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(JSON.stringify(errorData) || 'Identifiants incorrects');
    }
    return res.json();
  },
  
  getHotels: async (token, search = '') => {
    const url = search ? `${API_URL}/hotels/?search=${search}` : `${API_URL}/hotels/`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur lors du chargement des hôtels');
    return res.json();
  },
  
  createHotel: async (token, formData) => {
    const res = await fetch(`${API_URL}/hotels/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      // Note: Pas de Content-Type ici, le navigateur le gère pour le FormData (images)
      body: formData,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Erreur lors de la création');
    }
    return res.json();
  },
  
  getDashboardStats: async (token) => {
    // Vérification : urls.py indique 'auth/dashboard/stats/'
    const res = await fetch(`${API_URL}/auth/dashboard/stats/`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur lors de la récupération des statistiques');
    return res.json();
  },
  
  getMessages: async (token, type = 'all') => {
    const url = `${API_URL}/messages/?type=${type}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur lors du chargement des messages');
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
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Erreur lors de l\'envoi');
    }
    return res.json();
  },
  
  markMessageAsRead: async (token, messageId) => {
    const res = await fetch(`${API_URL}/messages/${messageId}/marquer_lu/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur');
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
    if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
    return res.json();
  },
};

export default api;