import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = ({ users }) => {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-amber-600" size={24} />;
      default:
        return null;
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-md';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-md';
      default:
        return 'bg-white border-gray-200 hover:shadow-md';
    }
  };

  const getPointsStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'text-yellow-600 font-bold';
      case 2:
        return 'text-gray-600 font-bold';
      case 3:
        return 'text-amber-600 font-bold';
      default:
        return 'text-gray-700 font-semibold';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="text-yellow-500" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
      </div>

      {/* Top 3 Users - Special Cards */}
      {sortedUsers.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sortedUsers.slice(0, 3).map((user, index) => {
              const rank = index + 1;
              return (
                <div
                  key={user.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${getRankStyle(rank)}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2">{getRankIcon(rank)}</div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">{user.name}</h3>
                    <p className={`text-xl ${getPointsStyle(rank)}`}>
                      {user.points.toLocaleString()} pts
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Remaining Users - List Format */}
      {sortedUsers.length > 3 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Rankings</h3>
          {sortedUsers.slice(3).map((user, index) => {
            const rank = index + 4;
            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                    {rank}
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800">{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-semibold">
                    {user.points.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sortedUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Trophy className="mx-auto mb-4 text-gray-300" size={48} />
          <p>No users yet. Add some users to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;