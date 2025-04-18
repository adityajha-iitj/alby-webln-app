import { useState, useEffect, useRef } from 'react';
import { useWebLN } from '../hooks/useWebLN';

function AutoPayment() {
  const { keysend } = useWebLN();
  const [enabled, setEnabled] = useState(false);
  const [destinationNode, setDestinationNode] = useState('');
  const [paymentsMade, setPaymentsMade] = useState(0);
  const [scrollEvents, setScrollEvents] = useState(0);
  const [lastPaymentTime, setLastPaymentTime] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  
  // Use a scrollable area for demo purposes
  const scrollAreaRef = useRef(null);
  // Cooldown timer to prevent excessive payments
  const cooldownPeriod = 3000; // 3 seconds

  const handleScroll = async () => {
    if (!enabled || !destinationNode) return;
    
    // Increment scroll events counter
    setScrollEvents(prev => prev + 1);
    
    // Check if cooldown period has passed
    const now = Date.now();
    if (lastPaymentTime && (now - lastPaymentTime < cooldownPeriod)) {
      return;
    }
    
    setStatus('Processing payment...');
    try {
      await keysend(destinationNode, 1); // Send 1 sat on scroll
      setPaymentsMade(prev => prev + 1);
      setLastPaymentTime(now);
      setStatus('Payment successful!');
      
      // Clear status after 2 seconds
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      setError(`Payment failed: ${err.message}`);
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  // Reset counters when destination changes or feature is toggled
  useEffect(() => {
    setPaymentsMade(0);
    setScrollEvents(0);
    setLastPaymentTime(null);
    setStatus('');
    setError('');
  }, [enabled, destinationNode]);

  const toggleAutoPayment = () => {
    if (!destinationNode && !enabled) {
      setError('Please enter a destination node public key.');
      return;
    }
    setEnabled(!enabled);
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="destinationNode" className="block mb-2 text-sm font-medium">
          Recipient Node Public Key
        </label>
        <input
          id="destinationNode"
          type="text"
          value={destinationNode}
          onChange={(e) => setDestinationNode(e.target.value)}
          placeholder="03xxxxxx..."
          disabled={enabled}
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleAutoPayment}
          className={`px-4 py-2 text-white font-bold rounded ${
            enabled 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {enabled ? 'Disable Auto-Payment' : 'Enable Auto-Payment'}
        </button>
        
        <div className="text-sm">
          <p>Scroll Events: {scrollEvents}</p>
          <p>Payments Made: {paymentsMade}</p>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
      
      {status && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded dark:bg-blue-900 dark:text-blue-300">
          {status}
        </div>
      )}
      
      <div 
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="border border-gray-300 rounded h-64 overflow-auto p-4 dark:border-gray-600"
      >
        <div className="h-96">
          <h3 className="text-lg font-medium mb-2">Scroll in this area to trigger payments</h3>
          <p className="mb-4">When auto-payment is enabled, scrolling in this box will send 1 sat to the specified node.</p>
          <p className="mb-4">A cooldown period of 3 seconds is enforced between payments to prevent excessive spending.</p>
          <p className="mb-4">This is just a demonstration of how WebLN can be integrated with user interactions.</p>
          <p className="mb-4">Keep scrolling down to see the counter increment and trigger payments.</p>
          <p>...</p>
          <p className="mb-4 mt-8">Keep going!</p>
          <p className="mb-4 mt-8">Almost there...</p>
          <p className="mb-4 mt-8">One more scroll...</p>
          <p className="mb-4 mt-8">You made it to the bottom!</p>
        </div>
      </div>
    </div>
  );
}

export default AutoPayment;