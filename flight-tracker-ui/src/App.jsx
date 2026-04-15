import React, { useState, useEffect, useRef } from 'react';
import GlobeWidget from './components/GlobeWidget';
import FlightDetailsCard from './components/FlightDetailsCard';
import AirportDetailsCard from './components/AirportDetailsCard'; 
import RegionSelector from './components/RegionSelector';
import Navbar from './components/Navbar'; // NEW IMPORT
import LeftPanel from './components/LeftPanel'; // NEW IMPORT
import { fetchLiveFlights, fetchFlightRoute, fetchAirports } from './api/flightApi'; 

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
  const [airports, setAirports] = useState([]); 
  
  const [selectedFlightData, setSelectedFlightData] = useState(null); 
  const [selectedAirportData, setSelectedAirportData] = useState(null); 
  
  // NEW: Track the active tool selected in the Navbar
  const [activeTool, setActiveTool] = useState('radar'); 
  
  const globeRef = useRef();

  // Default load (India)
  useEffect(() => {
    const loadInitialData = async () => {
      // Load both flights and airports simultaneously
      const [flightData, airportData] = await Promise.all([
        fetchLiveFlights('India', ''),
        fetchAirports('India')
      ]);

      if (flightData) setFlights(flightData);
      if (airportData) setAirports(airportData);
    };
    loadInitialData();
  }, []);

  // Handle Region Change & Spin Camera
  const handleRegionSubmit = async (country, state) => {
    if (globeRef.current && cameraPositions[country]) {
      globeRef.current.pointOfView(cameraPositions[country], 2000);
    }

    // Clear old data so the user knows it's loading
    setFlights([]); 
    setAirports([]); 

    // Fetch the new data
    const [flightData, airportData] = await Promise.all([
      fetchLiveFlights(country, state),
      fetchAirports(country)
    ]);

    if (flightData) setFlights(flightData);
    if (airportData) setAirports(airportData);
  };

  const handleFlightClick = async (point) => {
    setSelectedAirportData(null); // Hide the airport card if it's open
    try {
      const combinedData = await fetchFlightRoute(point.callsign);
      setSelectedFlightData(combinedData); 
    } catch (error) {
      console.error("Error fetching specific flight details:", error);
    }
  };

  // Handle Airport Click
  const handleAirportClick = (airport) => {
    setSelectedFlightData(null); // Hide the flight card if it's open
    setSelectedAirportData(airport);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0b0f1a', overflow: 'hidden', position: 'relative' }}>
      
      {/* SkyWatch Logo - INCREASED zIndex to 1000 so it stays above the Left Panel */}
      <div style={{ position: 'absolute', top: '25px', left: '30px', zIndex: 1000, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
        <span style={{ fontSize: '24px', fontWeight: '900', color: '#ffba00', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>SkyWatch</span>
        <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '1.5px', textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}>LIVE AIRSPACE ANALYTICS</span>
      </div>

      {/* NEW: The Top Dashboard Navigation */}
      <Navbar activeTool={activeTool} onToolSelect={setActiveTool} />

      <RegionSelector onShowFlights={handleRegionSubmit} />

      {/* NEW: The Left Tool Panel */}
      <LeftPanel activeTool={activeTool} onClose={() => setActiveTool('radar')} />

      <div style={{ width: '100%', height: '100%' }}>
        <GlobeWidget 
          ref={globeRef} 
          flights={flights} 
          onFlightClick={handleFlightClick} 
          airports={airports} 
          onAirportClick={handleAirportClick} 
        />
      </div>

      {/* Sliding Information Panels */}
      {selectedFlightData && (
        <FlightDetailsCard flightData={selectedFlightData} onClose={() => setSelectedFlightData(null)} />
      )}

      {selectedAirportData && (
        <AirportDetailsCard airport={selectedAirportData} onClose={() => setSelectedAirportData(null)} />
      )}

    </div>
  );
}

export default App;