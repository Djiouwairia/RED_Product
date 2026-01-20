import React from 'react';
import { Home, LogOut, User } from 'lucide-react';

const Sidebar = ({ currentPage, onNavigate, onLogout }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center mb-8">
          <Home className="w-6 h-6 mr-2" />
          <span className="text-xl font-bold">RED PRODUCT</span>
        </div>
        
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-2">Principal</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full text-left px-4 py-2 rounded mb-2 ${
              currentPage === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('hotels')}
            className={`w-full text-left px-4 py-2 rounded mb-2 ${
              currentPage === 'hotels' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Liste des hôtels
          </button>
          <button
            onClick={() => onNavigate('messages')}
            className={`w-full text-left px-4 py-2 rounded ${
              currentPage === 'messages' ? 'bg-gray-700' : 'hover:bg-gray-700'
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
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;