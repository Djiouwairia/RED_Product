import React, { useState, useEffect } from 'react';
import api from '../../api/api';

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

export default Dashboard;