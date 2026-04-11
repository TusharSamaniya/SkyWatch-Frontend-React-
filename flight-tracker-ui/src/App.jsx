import React, { useState, useEffect } from 'react';
import GlobeWidget from './components/GlobeWidget';
import FlightDetailsCard from './components/FlightDetailsCard';
import { fetchLiveFlights, fetchFlightRoute } from './api/flightApi';

function App() {
  const [flights, setFlights] = useState([]);
  const [selectedFlightData, setSelectedFlightData] = useState(null); 

  useEffect(() => {
    const getFlights = async () => {
      try {
        const data = await fetchLiveFlights();
        if (data) setFlights(data);
      } catch (error) {
        console.error("Failed to load flights:", error);
      }
    };
    
    getFlights(); 
    const intervalId = setInterval(getFlights, 60000); 
    return () => clearInterval(intervalId); 
  }, []);

  const handleFlightClick = async (point) => {
    try {
      const combinedData = await fetchFlightRoute(point.callsign);
      setSelectedFlightData(combinedData); 
    } catch (error) {
      console.error("Error fetching specific flight details:", error);
    }
  };

  return (
    // Main App Shell
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0b0f1a', overflow: 'hidden', position: 'relative' }}>
      
      {/* NEW: Floating SkyWatch Logo */}
      <div style={{
        position: 'absolute',
        top: '25px',
        left: '30px',
        zIndex: 100, 
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'none' // Ensures you can still click planes that fly behind the text
      }}>
        <span style={{ fontSize: '24px', fontWeight: '900', color: '#ffba00', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
          SkyWatch
        </span>
        <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '1.5px', textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}>
          LIVE INDIA AIRSPACE ANALYTICS
        </span>
      </div>

      {/* 1. The Main Stage / Globe Area (Full Screen) */}
      <div style={{ width: '100%', height: '100%' }}>
        <GlobeWidget flights={flights} onFlightClick={handleFlightClick} />
      </div>

      {/* 2. The Sliding Information Panel */}
      {selectedFlightData && (
        <FlightDetailsCard 
          flightData={selectedFlightData} 
          onClose={() => setSelectedFlightData(null)} 
        />
      )}

    </div>
  );
}

export default App;