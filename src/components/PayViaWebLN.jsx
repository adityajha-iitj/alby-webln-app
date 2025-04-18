import { useState } from 'react';
import { useWebLN } from '../hooks/useWebLN';
import SatsConverter from './SatsConverter';

function PayViaWebLN() {
  const { payLnAddress } = useWebLN();
  const [lnAddress, setLnAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!lnAddress || !amount) {
      setError('Please enter both a Lightning address and amount');
      return;
    }

    // Basic validation for Lightning address format
    if (!lnAddress.includes('@')) {
      setError('Invalid Lightning address format (should be like user@domain.com)');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await payLnAddress(lnAddress, parseInt(amount));
      setSuccess(true);
      setLnAddress('');
      setAmount('');
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label htmlFor="lnAddress" className="block mb-2 text-sm font-medium">
            Lightning Address
          </label>
          <input
            id="lnAddress"
            type="text"
            value={lnAddress}
            onChange={(e) => setLnAddress(e.target.value)}
            placeholder="user@domain.com"
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block mb-2 text-sm font-medium">
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
        
        <button
          type="submit"
          disabled={loading || !lnAddress || !amount}
          className={`w-full px-4 py-2 text-white font-bold rounded ${
            loading || !lnAddress || !amount
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Pay to Lightning Address'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded dark:bg-green-900 dark:text-green-300">
          Payment sent successfully!
        </div>
      )}
    </div>
  );
}

export default PayViaWebLN;