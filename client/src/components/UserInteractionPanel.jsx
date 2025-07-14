import React, { useState } from 'react';
import { Users, Plus, Trophy, Mail, Lock } from 'lucide-react';

const UserInteractionPanel = ({
  users,
  onAddUser,
  onClaimPoints,
}) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleAddUser = () => {
    if (newUserName.trim() && newUserEmail.trim() && newUserPassword.trim()) {
      onAddUser(newUserName.trim(), newUserEmail.trim(), newUserPassword.trim());
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setIsAddingUser(false);
    }
  };

  const handleClaimPoints = () => {
    if (selectedUserId) {
      onClaimPoints(selectedUserId);
      setSelectedUserId('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddUser();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="text-yellow-500" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Claim Points</h2>
      </div>

      {/* User Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select User
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 transition-all duration-200"
          >
            <option value="">Choose a user...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New User */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Add New User
          </label>
          <button
            onClick={() => setIsAddingUser(!isAddingUser)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
          >
            {isAddingUser ? 'Cancel' : 'Add User'}
          </button>
        </div>
        
        {isAddingUser && (
          <div className="space-y-3 mt-2">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter user name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                placeholder="Enter password"
                minLength={6}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddUser}
                disabled={!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <Plus size={16} />
                Add User
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Claim Points Button */}
      <button
        onClick={handleClaimPoints}
        disabled={!selectedUserId}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
          selectedUserId
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 hover:scale-105 shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        🏆 Claim Points
      </button>
    </div>
  );
};

export default UserInteractionPanel;