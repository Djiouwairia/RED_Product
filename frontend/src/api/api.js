const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = {
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Erreur lors de l\'inscription');
    }
    return res.json();
  },
  
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Identifiants incorrects');
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
      body: formData,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Erreur lors de la création');
    }
    return res.json();
  },
  
  getDashboardStats: async (token) => {
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