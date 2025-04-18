import { useState, useEffect } from 'react';

function SatsConverter() {
  const [sats, setSats] = useState('');
  const [fiat, setFiat] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  
  // Fetch Bitcoin price when currency changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency.toLowerCase()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rate');
        }
        
        const data = await response.json();
        const btcPrice = data.bitcoin[currency.toLowerCase()];
        
        // Calculate sats per unit of fiat (1 BTC = 100,000,000 sats)
        const satsPerUnit = 100000000 / btcPrice;
        setExchangeRate(satsPerUnit);
      } catch (err) {
        setError('Failed to fetch exchange rate. Using estimated values.');
        // Fallback to estimated exchange rates if API fails
        const fallbackRates = {
          'USD': 2500, // 1 USD ≈ 2,500 sats (at 40,000 USD/BTC)
          'EUR': 2700, // 1 EUR ≈ 2,700 sats
          'GBP': 3200, // 1 GBP ≈ 3,200 sats
          'JPY': 17,   // 1 JPY ≈ 17 sats
          'CAD': 1850, // 1 CAD ≈ 1,850 sats
          'AUD': 1700  // 1 AUD ≈ 1,700 sats
        };
        setExchangeRate(fallbackRates[currency] || 2500);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExchangeRate();
  }, [currency]);

  // Convert sats to fiat
  const handleSatsChange = (value) => {
    setSats(value);
    if (value && exchangeRate) {
      const fiatValue = parseFloat(value) / exchangeRate;
      setFiat(fiatValue.toFixed(2));
    } else {
      setFiat('');
    }
  };

  // Convert fiat to sats
  const handleFiatChange = (value) => {
    setFiat(value);
    if (value && exchangeRate) {
      const satsValue = parseFloat(value) * exchangeRate;
      setSats(Math.round(satsValue));
    } else {
      setSats('');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-xs text-orange-600 dark:text-orange-400">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="sats" className="block mb-2 text-sm font-medium">
          Satoshis
        </label>
        <input
          id="sats"
          type="number"
          min="0"
          value={sats}
          onChange={(e) => handleSatsChange(e.target.value)}
          placeholder="1000"
          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 flex items-center justify-center">
          <span className="text-lg">⇅</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <div className="flex-1">
          <label htmlFor="fiat" className="block mb-2 text-sm font-medium">
            Fiat Amount
          </label>
          <input
            id="fiat"
            type="number"
            min="0"
            step="0.01"
            value={fiat}
            onChange={(e) => handleFiatChange(e.target.value)}
            placeholder="1.00"
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div className="w-24">
          <label htmlFor="currency" className="block mb-2 text-sm font-medium">
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {exchangeRate && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Rate: 1 {currency} ≈ {Math.round(exchangeRate)} sats
        </div>
      )}
    </div>
  );
}

export default SatsConverter;