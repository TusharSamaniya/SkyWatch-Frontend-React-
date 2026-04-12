import React, { useState, useEffect, useRef } from 'react';
import GlobeWidget from './components/GlobeWidget';
import FlightDetailsCard from './components/FlightDetailsCard';
import RegionSelector from './components/RegionSelector'; // NEW IMPORT
import { fetchLiveFlights, fetchFlightRoute } from './api/flightApi';

// Camera Coordinates for the cinematic spin
const cameraPositions = {
  India: { lat: 21.0, lng: 78.0, altitude: 2.5 },
  USA: { lat: 39.0, lng: -98.0, altitude: 2.5 },
  UK: { lat: 55.0, lng: -3.0, altitude: 1.5 },
  Australia: { lat: -25.0, lng: 133.0, altitude: 2.5 },
  Canada: { lat: 56.0, lng: -106.0, altitude: 2.5 },
  Japan: { lat: 36.0, lng: 138.0, altitude: 1.5 }
};

function App() {
  const [flights, setFlights] = useState([]);
  const [selectedFlightData, setSelectedFlightData] = useState(null); 
  const globeRef = useRef(); // We need this to control the camera!

  // Default load (India)
  useEffect(() => {
    const loadInitialFlights = async () => {
      const data = await fetchLiveFlights('India', '');
      if (data) setFlights(data);
    };
    loadInitialFlights();
  }, []);

  // NEW: Handle Region Change & Spin Camera
  const handleRegionSubmit = async (country, state) => {
    // 1. Spin the camera smoothly over 2 seconds (2000ms)
    if (globeRef.current && cameraPositions[country]) {
      globeRef.current.pointOfView(cameraPositions[country], 2000);
    }

    // 2. Clear old flights so the user knows it's loading
    setFlights([]); 

    // 3. Fetch the new flights
    const data = await fetchLiveFlights(country, state);
    if (data) setFlights(data);
  };

  const handleFlightClick = async (point) => {
    try {
      const combinedData = await fetchFlightRoute(point.callsign);
      setSelectedFlightData(combinedData); 
    } catch (error) {
      console.error("Error fetching specific flight details:", error);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0b0f1a', overflow: 'hidden', position: 'relative' }}>
      
      {/* SkyWatch Logo */}
      <div style={{ position: 'absolute', top: '25px', left: '30px', zIndex: 100, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
        <span style={{ fontSize: '24px', fontWeight: '900', color: '#ffba00', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>SkyWatch</span>
        <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '1.5px', textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}>LIVE AIRSPACE ANALYTICS</span>
      </div>

      {/* NEW: The Geographic Filter UI */}
      <RegionSelector onShowFlights={handleRegionSubmit} />

      {/* Main Globe Area */}
      <div style={{ width: '100%', height: '100%' }}>
        <GlobeWidget 
          ref={globeRef} // Pass the ref to the globe
          flights={flights} 
          onFlightClick={handleFlightClick} 
        />
      </div>

      {/* Sliding Information Panel */}
      {selectedFlightData && (
        <FlightDetailsCard flightData={selectedFlightData} onClose={() => setSelectedFlightData(null)} />
      )}

    </div>
  );
}

export default App;