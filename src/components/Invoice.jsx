import { useState } from 'react';
import { useWebLN } from '../hooks/useWebLN';
import { QRCodeSVG } from 'qrcode.react';

function Invoice() {
  const { makeInvoice } = useWebLN();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState('');

  const handleMakeInvoice = async (e) => {
    e.preventDefault();
    
    if (!amount) {
      setError('Please enter an amount');
      return;
    }

    setLoading(true);
    setError('');
    setInvoice(null);

    try {
      const result = await makeInvoice(parseInt(amount), description || 'Invoice created via WebLN app');
      setInvoice(result);
    } catch (err) {
      setError(err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!invoice || !invoice.paymentRequest) return;
    
    navigator.clipboard.writeText(invoice.paymentRequest)
      .then(() => {
        // Show temporary "Copied" message
        const button = document.getElementById('copyButton');
        const originalText = button.innerText;
        button.innerText = 'Copied!';
        setTimeout(() => {
          button.innerText = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div>
      <form onSubmit={handleMakeInvoice} className="space-y-4">
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
        
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this invoice for?"
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !amount}
          className={`w-full px-4 py-2 text-white font-bold rounded ${
            loading || !amount
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
          }`}
        >
          {loading ? 'Creating...' : 'Create Invoice'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}

      {invoice && invoice.paymentRequest && (
        <div className="mt-4 space-y-4">
          <div className="bg-gray-100 p-4 rounded dark:bg-gray-700">
            <div className="text-sm font-medium mb-2">Invoice</div>
            <div className="break-all text-xs">{invoice.paymentRequest}</div>
          </div>
          
          <div className="flex justify-center mb-4">
            <QRCodeSVG value={invoice.paymentRequest} size={200} />
          </div>
          
          <button
            id="copyButton"
            onClick={copyToClipboard}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
          >
            Copy Invoice
          </button>
        </div>
      )}
    </div>
  );
}

export default Invoice;