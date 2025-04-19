import { useState } from 'react';
import { useWebLN } from '../hooks/useWebLN';

function WalletInfo({ nodeInfo, darkMode }) {
  const { getInfo } = useWebLN();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshNodeInfo = async () => {
    setLoading(true);
    setError('');
    
    try {
      await getInfo();
    } catch (err) {
      setError(`Failed to refresh: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-600'}`}>Your Wallet Info</h2>
        <button
          onClick={refreshNodeInfo}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {error && (
        <div className={`mb-4 p-2 rounded ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}>
          {error}
        </div>
      )}
      
      {nodeInfo ? (
        <div className="space-y-2">
            <div className={`p-3 rounded ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
              <p className="text-sm font-medium">Node Alias</p>
            <p className="font-bold">{nodeInfo.alias || 'Unknown'}</p>
          </div>
          
          {nodeInfo.pubkey && (
            <div className={`p-3 rounded ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
              <p className="text-sm font-medium">Public Key</p>
              <p className="text-xs break-all">{nodeInfo.pubkey}</p>
            </div>
          )}
          
          {nodeInfo.color && (
            <div className={`p-3 rounded flex items-center ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
              <p className="text-sm font-medium mr-2">Node Color</p>
              <div 
                className="w-6 h-6 rounded border border-gray-300" 
                style={{ backgroundColor: `#${nodeInfo.color}` }}
              ></div>
            </div>
          )}
          
          {nodeInfo.methods && (
            <div className={`p-3 rounded ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
              <p className="text-sm font-medium">Supported Methods</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {nodeInfo.methods.map((method) => (
                  <span 
                    key={method} 
                    className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {loading ? 'Loading wallet information...' : 'No wallet information available'}
        </div>
      )}
    </div>
  );
}

export default WalletInfo;