import React, { useState, useEffect } from 'react';
import { Send, Inbox, Trash2 } from 'lucide-react';
import api from '../../api/api';
import NewMessageForm from './NewMessageForm';

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
      const results = data.results || data;
      setMessages(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error("Erreur lors du chargement des messages:", err);
      setMessages([]);
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

export default MessagesPage;