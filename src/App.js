import { useState, useEffect } from 'react';
import SendPayment from './components/SendPayment';
import Keysend from './components/Keysend';
import AutoPayment from './components/AutoPayment';
import WalletInfo from './components/WalletInfo';
import Invoice from './components/Invoice';
import PayViaWebLN from './components/PayViaWebLN';
import QRScanner from './components/QRScanner';
import ThemeToggle from './components/ThemeToggle';
import SatsConverter from './components/SatsConverter';
import { useWebLN } from './hooks/useWebLN';
import './index.css';

function App() {
  const { connected, error, nodeInfo } = useWebLN();
  const [darkMode, setDarkMode] = useState(false);
  
  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <header className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-600'}`}>⚡ Lightning Web App</h1>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </header>

      <main className="container mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error: </strong> {error}
          </div>
        )}

        {!connected && !error && (
          <div className={`border px-4 py-3 rounded mb-4 ${darkMode ? 'bg-yellow-800 border-yellow-700 text-yellow-200' : 'bg-yellow-100 border-yellow-400 text-yellow-700'}`}>
            Connecting to WebLN provider...
          </div>
        )}

        {connected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WalletInfo nodeInfo={nodeInfo} darkMode={darkMode} />
            
            <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-600'}`}>Convert Currency</h2>
              <SatsConverter darkMode={darkMode} />
            </div>
            
            <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-600'}`}>Make an Invoice</h2>
              <Invoice darkMode={darkMode} />
            </div>
            
            <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-600'}`}>Pay an Invoice</h2>
              <SendPayment darkMode={darkMode} />
            </div>
            
            <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-600'}`}>Pay to Lightning Address</h2>
              <PayViaWebLN darkMode={darkMode} />
            </div>
            
            <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-600'}`}>Keysend Payment</h2>
              <Keysend darkMode={darkMode} />
            </div>
            
            <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-600'}`}>QR Code Scanner</h2>
              <QRScanner darkMode={darkMode} />
            </div>
            
            <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} col-span-1 md:col-span-2`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-600'}`}>Auto-Payment on Scroll</h2>
              <AutoPayment darkMode={darkMode} />
            </div>
          </div>
        )}
      </main>
      
      <footer className={`p-4 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} shadow mt-8`}>
        <div className="container mx-auto text-center">
          <p>WebLN Demo Application with Alby SDK Integration</p>
        </div>
      </footer>
    </div>
  );
}

export default App;