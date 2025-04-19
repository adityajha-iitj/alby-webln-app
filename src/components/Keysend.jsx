import { useState } from 'react';
import { useWebLN } from '../hooks/useWebLN';

function Keysend() {
  const { keysend } = useWebLN();
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleKeysend = async (e) => {
    e.preventDefault();
    if (!destination || !amount) {
      setError('Please enter a destination node ID and amount');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // If message exists, add it as a custom record with key 34349334
      const customRecords = message ? { '34349334': message } : {};
      
      await keysend(destination, parseInt(amount), customRecords);
      setSuccess(true);
      setDestination('');
      setAmount('');
      setMessage('');
    } catch (err) {
      setError(err.message || 'Keysend failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleKeysend} className="space-y-4">
        <div>
          <label htmlFor="destination" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-700">
            Destination Node Public Key
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="03xxxxxx..."
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-700">
            Amount (sats)
          </label>
          <input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-700">
            Message (optional)
          </label>
          <input
            id="message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional message"
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !destination || !amount}
          className={`w-full px-4 py-2 text-white font-bold rounded ${
            loading || !destination || !amount
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Send Keysend Payment'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded dark:bg-green-900 dark:text-green-300">
          Keysend payment sent successfully!
        </div>
      )}
    </div>
  );
}

export default Keysend;