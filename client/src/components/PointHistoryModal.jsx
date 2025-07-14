import React from 'react';
import { X, Clock, Trophy } from 'lucide-react';

const PointHistoryModal = ({
  isOpen,
  onClose,
  pointHistory,
}) => {
  if (!isOpen) return null;

  const formatTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-500" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Point History</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {pointHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="mx-auto mb-4 text-gray-300" size={48} />
              <p>No point claims yet. Start claiming points to see history!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pointHistory.map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {claim.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{claim.userName}</p>
                      <div className="text-sm text-gray-500">
                        <p>{formatTime(claim.timestamp)}</p>
                        {claim.claimedBy && (
                          <p>Claimed by: {claim.claimedBy}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold text-lg">+{claim.points}</span>
                    <Trophy className="text-yellow-500" size={16} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointHistoryModal;