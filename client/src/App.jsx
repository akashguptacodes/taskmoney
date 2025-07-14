import React, { useState, useEffect } from 'react';
import { History, LogOut, User as UserIcon } from 'lucide-react';
import UserInteractionPanel from './components/UserInteractionPanel';
import Leaderboard from './components/Leaderboard';
import ToastNotification from './components/ToastNotification';
import PointHistoryModal from './components/PointHistoryModal';
import AuthModal from './components/AuthModal';
import { apiService } from './services/api';

function App() {
  const [users, setUsers] = useState([]);
  const [pointHistory, setPointHistory] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      if (apiService.isAuthenticated()) {
        const userResponse = await apiService.getCurrentUser();
        setCurrentUser(userResponse.user);
      }
      await loadUsers();
      await loadPointHistory();
    } catch (error) {
      console.error('Failed to initialize app:', error);
      if (apiService.isAuthenticated()) {
        apiService.logout();
        setIsAuthModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiService.getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadPointHistory = async () => {
    try {
      const response = await apiService.getPointHistory();
      setPointHistory(response.history.map(claim => ({
        ...claim,
        timestamp: new Date(claim.timestamp)
      })));
    } catch (error) {
      console.error('Failed to load point history:', error);
    }
  };

  const handleAddUser = async (name, email, password) => {
    try {
      await apiService.createUser(name, email, password);
      await loadUsers();
      setToastMessage(`${name} added to leaderboard!`);
      setIsToastVisible(true);
    } catch (error) {
      setToastMessage(`Error: ${error.message}`);
      setIsToastVisible(true);
    }
  };

  const handleClaimPoints = async (userId) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const response = await apiService.claimPoints(userId);
      await loadUsers();
      await loadPointHistory();
      
      setToastMessage(`${response.claim.userName} claimed ${response.claim.points} points! 🎉`);
      setIsToastVisible(true);
    } catch (error) {
      setToastMessage(`Error: ${error.message}`);
      setIsToastVisible(true);
    }
  };

  const handleCloseToast = () => {
    setIsToastVisible(false);
  };

  const handleAuth = (token, user) => {
    setCurrentUser(user);
    loadUsers();
    loadPointHistory();
  };

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    setUsers([]);
    setPointHistory([]);
    setIsAuthModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🏆 Leaderboard Points System
            </h1>
            <p className="text-gray-600">Claim points and climb the leaderboard!</p>
          </div>
          
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                <UserIcon size={20} className="text-blue-600" />
                <span className="font-medium text-gray-800">{currentUser.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Sign In
            </button>
          )}
        </div>

        {currentUser && (
          <>
            {/* History Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium"
              >
                <History size={20} />
                View Point History
              </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {/* Left Panel - User Interaction */}
              <div className="order-2 lg:order-1">
                <UserInteractionPanel
                  users={users}
                  onAddUser={handleAddUser}
                  onClaimPoints={handleClaimPoints}
                />
              </div>

              {/* Right Panel - Leaderboard */}
              <div className="order-1 lg:order-2">
                <Leaderboard users={users} />
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12 text-gray-500">
              <p className="text-sm">
                Points are randomly awarded between 1-10 per claim
              </p>
            </div>
          </>
        )}

        {!currentUser && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to the Leaderboard!
            </h2>
            <p className="text-gray-600 mb-8">
              Sign in to start claiming points and compete with others.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <ToastNotification
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={handleCloseToast}
      />

      {/* Point History Modal */}
      {currentUser && (
        <PointHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          pointHistory={pointHistory}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={handleAuth}
      />
    </div>
  );
}

export default App;