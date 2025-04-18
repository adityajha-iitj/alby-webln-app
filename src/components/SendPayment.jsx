import { useState } from 'react';
import { useWebLN } from '../hooks/useWebLN';
import QRCode from 'qrcode.react';

function SendPayment() {
  const { sendPayment } = useWebLN();
  const [invoice, setInvoice] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentResponse, setPaymentResponse] = useState(null);

  const handleSendPayment = async (e) => {
    e.preventDefault();
    if (!invoice) {
      setError('Please enter a Lightning invoice');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setPaymentResponse(null);

    try {
      const response = await sendPayment(invoice);
      setPaymentResponse(response);
      setSuccess(true);
      setInvoice('');
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSendPayment} className="space-y-4">
        <div>
          <label htmlFor="invoice" className="block mb-2 text-sm font-medium">
            Lightning Invoice
          </label>
          <textarea
            id="invoice"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            placeholder="Enter a Lightning invoice (BOLT11)"
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            rows="3"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !invoice}
          className={`w-full px-4 py-2 text-white font-bold rounded ${
            loading
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Pay Invoice'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded dark:bg-green-900 dark:text-green-300">
          Payment successful!
          {paymentResponse && (
            <div className="mt-2 text-sm">
              <p>Preimage: {paymentResponse.preimage}</p>
              {paymentResponse.paymentHash && <p>Payment Hash: {paymentResponse.paymentHash}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SendPayment;