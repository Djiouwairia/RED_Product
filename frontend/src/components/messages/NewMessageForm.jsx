import React, { useState, useEffect } from 'react';
import api from '../../api/api';

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

  const loadUsers = async () => {
    try {
      const data = await api.getUsers(token);
      const userList = data.results || data;
      setUsers(Array.isArray(userList) ? userList : []);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs:", err);
      setUsers([]);
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

export default NewMessageForm;