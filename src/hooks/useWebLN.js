import { useState, useEffect } from 'react';
import { webln } from '@getalby/sdk';

export function useWebLN() {
  const [provider, setProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [nodeInfo, setNodeInfo] = useState(null);

  // Initialize WebLN provider on component mount
  useEffect(() => {
    const initWebLN = async () => {
      try {
        // First check if WebLN is available via browser extension
        if (typeof window.webln !== 'undefined') {
          try {
            await window.webln.enable();
            setProvider(window.webln);
            setConnected(true);
            
            // Get initial node info
            try {
              const info = await window.webln.getInfo();
              setNodeInfo(info);
            } catch (infoError) {
              console.warn("Could not fetch node info:", infoError);
            }
          } catch (extensionError) {
            console.warn("Browser extension error:", extensionError);
            setError(`WebLN extension error: ${extensionError.message}`);
          }
        } else {
          // No browser extension available
          setError("No WebLN provider found. Please install Alby extension or another WebLN provider.");
        }
      } catch (err) {
        setError(`Failed to connect to WebLN: ${err.message}`);
        console.error(err);
      }
    };

    initWebLN();
  }, []);

  // Function to send payment via WebLN
  const sendPayment = async (paymentRequest) => {
    if (!provider) throw new Error("WebLN provider not available");
    
    try {
      const response = await provider.sendPayment(paymentRequest);
      return response;
    } catch (err) {
      setError(`Payment failed: ${err.message}`);
      throw err;
    }
  };

  // Function to send a keysend payment
  const keysend = async (destination, amount, customRecords = {}) => {
    if (!provider) throw new Error("WebLN provider not available");
    
    try {
      const response = await provider.keysend({
        destination,
        amount,
        customRecords
      });
      return response;
    } catch (err) {
      setError(`Keysend failed: ${err.message}`);
      throw err;
    }
  };

  // Function to get wallet information
  const getInfo = async () => {
    if (!provider) throw new Error("WebLN provider not available");
    
    try {
      const info = await provider.getInfo();
      setNodeInfo(info);
      return info;
    } catch (err) {
      setError(`Failed to get wallet info: ${err.message}`);
      throw err;
    }
  };

  // Function to create an invoice
  const makeInvoice = async (amount, description, defaultMemo = "") => {
    if (!provider) throw new Error("WebLN provider not available");
    
    try {
      const invoice = await provider.makeInvoice({
        amount: amount,
        defaultMemo: defaultMemo || description,
        description: description
      });
      return invoice;
    } catch (err) {
      setError(`Failed to create invoice: ${err.message}`);
      throw err;
    }
  };

  // Function to send payment to an LN address
  const payLnAddress = async (lnAddress, amount) => {
    if (!provider) throw new Error("WebLN provider not available");
    
    try {
      // First, resolve the LNURL from the LN address
      const { invoice } = await provider.requestLnurlPay({
        lnUrlOrAddress: lnAddress,
        tokens: amount
      });
      
      // Then, pay the invoice
      if (invoice) {
        const response = await provider.sendPayment(invoice);
        return response;
      } else {
        throw new Error("Failed to generate invoice from LN address");
      }
    } catch (err) {
      setError(`LN Address payment failed: ${err.message}`);
      throw err;
    }
  };

  return {
    provider,
    connected,
    error,
    nodeInfo,
    sendPayment,
    keysend,
    getInfo,
    makeInvoice,
    payLnAddress
  };
}