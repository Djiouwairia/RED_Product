import React, { useState } from 'react';
import { Plus } from 'lucide-react';

// Components Auth
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';

// Components Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Components Hotels
import HotelsList from './components/hotels/HotelsList';
import CreateHotel from './components/hotels/CreateHotel';

// Components Messages
import MessagesPage from './components/messages/MessagesPage';

// Components Layout
import Sidebar from './components/layout/Sidebar';

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

  // Pages d'authentification (non protégées)
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
      <Sidebar 
        currentPage={page}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {page === 'dashboard' && 'Dashboard'}
            {page === 'hotels' && 'Liste des hôtels'}
            {page === 'messages' && 'Messages'}
            {page === 'create-hotel' && 'Créer un hôtel'}
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
        
        {/* Main Content */}
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