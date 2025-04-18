import { useState } from 'react';
import { useWebLN } from '../hooks/useWebLN';

function WalletInfo({ nodeInfo }) {
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
    <div className="rounded-lg shadow p-6 bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Wallet Info</h2>
        <button
          onClick={refreshNodeInfo}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
      
      {nodeInfo ? (
        <div className="space-y-2">
          <div className="bg-gray-100 p-3 rounded dark:bg-gray-700">
            <p className="text-sm font-medium">Node Alias</p>
            <p className="font-bold">{nodeInfo.alias || 'Unknown'}</p>
          </div>
          
          {nodeInfo.pubkey && (
            <div className="bg-gray-100 p-3 rounded dark:bg-gray-700">
              <p className="text-sm font-medium">Public Key</p>
              <p className="text-xs break-all">{nodeInfo.pubkey}</p>
            </div>
          )}
          
          {nodeInfo.color && (
            <div className="bg-gray-100 p-3 rounded dark:bg-gray-700 flex items-center">
              <p className="text-sm font-medium mr-2">Node Color</p>
              <div 
                className="w-6 h-6 rounded border border-gray-300" 
                style={{ backgroundColor: `#${nodeInfo.color}` }}
              ></div>
            </div>
          )}
          
          {nodeInfo.methods && (
            <div className="bg-gray-100 p-3 rounded dark:bg-gray-700">
              <p className="text-sm font-medium">Supported Methods</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {nodeInfo.methods.map((method) => (
                  <span 
                    key={method} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded dark:bg-blue-900 dark:text-blue-300"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          {loading ? 'Loading wallet information...' : 'No wallet information available'}
        </div>
      )}
    </div>
  );
}

export default WalletInfo;