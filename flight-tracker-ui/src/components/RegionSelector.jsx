import React, { useState } from 'react';

// The React Dictionary (Must match your Spring Boot dictionary!)
const regions = {
  India: ['Delhi', 'Maharashtra', 'Karnataka'],
  USA: ['New York', 'California', 'Texas'],
  UK: ['England', 'Scotland'],
  Australia: ['New South Wales', 'Victoria'],
  Canada: ['Ontario', 'British Columbia'],
  Japan: ['Tokyo', 'Osaka']
};

const RegionSelector = ({ onShowFlights }) => {
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setState(''); // Reset state when country changes
  };

  const handleShowFlights = () => {
    onShowFlights(country, state);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '25px',
      right: '30px',
      background: 'rgba(17, 24, 39, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid #374151',
      padding: '15px',
      borderRadius: '8px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      width: '250px'
    }}>
      <h3 style={{ color: '#ffba00', margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Select Region
      </h3>

      {/* Country Dropdown */}
      <select 
        value={country} 
        onChange={handleCountryChange}
        style={{ padding: '8px', background: '#1f2937', color: 'white', border: '1px solid #4b5563', borderRadius: '4px', outline: 'none' }}
      >
        {Object.keys(regions).map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* State Dropdown */}
      <select 
        value={state} 
        onChange={(e) => setState(e.target.value)}
        style={{ padding: '8px', background: '#1f2937', color: 'white', border: '1px solid #4b5563', borderRadius: '4px', outline: 'none' }}
      >
        <option value="">Entire Country</option>
        {regions[country].map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Submit Button */}
      <button 
        onClick={handleShowFlights}
        style={{
          marginTop: '5px',
          padding: '10px',
          background: '#ffba00',
          color: '#000',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.target.style.background = '#e6a800'}
        onMouseOut={(e) => e.target.style.background = '#ffba00'}
      >
        Show Flights
      </button>
    </div>
  );
};

export default RegionSelector;