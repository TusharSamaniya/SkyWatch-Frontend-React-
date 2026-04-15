import React, { useState, useEffect, useRef } from 'react';
import GlobeWidget from './components/GlobeWidget';
import FlightDetailsCard from './components/FlightDetailsCard';
import AirportDetailsCard from './components/AirportDetailsCard'; 
import RegionSelector from './components/RegionSelector';
import Navbar from './components/Navbar'; 
import LeftPanel from './components/LeftPanel'; 
import { fetchLiveFlights, fetchFlightRoute, fetchAirports } from './api/flightApi'; 

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
  
  const [activeTool, setActiveTool] = useState('radar'); 
  const [activeArc, setActiveArc] = useState(null); // NEW: State to hold the glowing line!
  
  const globeRef = useRef();

  useEffect(() => {
    const loadInitialData = async () => {
      const [flightData, airportData] = await Promise.all([
        fetchLiveFlights('India', ''),
        fetchAirports('India')
      ]);
      if (flightData) setFlights(flightData);
      if (airportData) setAirports(airportData);
    };
    loadInitialData();
  }, []);

  const handleRegionSubmit = async (country, state) => {
    if (globeRef.current && cameraPositions[country]) {
      globeRef.current.pointOfView(cameraPositions[country], 2000);
    }
    setFlights([]); 
    setAirports([]); 
    setActiveArc(null); // Clear the arc when we move regions

    const [flightData, airportData] = await Promise.all([
      fetchLiveFlights(country, state),
      fetchAirports(country)
    ]);
    if (flightData) setFlights(flightData);
    if (airportData) setAirports(airportData);
  };

  const handleFlightClick = async (point) => {
    setSelectedAirportData(null); 
    try {
      const combinedData = await fetchFlightRoute(point.callsign);
      setSelectedFlightData(combinedData); 
    } catch (error) {
      console.error("Error fetching specific flight details:", error);
    }
  };

  const handleAirportClick = (airport) => {
    setSelectedFlightData(null); 
    setSelectedAirportData(airport);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0b0f1a', overflow: 'hidden', position: 'relative' }}>
      
      <div style={{ position: 'absolute', top: '25px', left: '30px', zIndex: 1000, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
        <span style={{ fontSize: '24px', fontWeight: '900', color: '#ffba00', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>SkyWatch</span>
        <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '1.5px', textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}>LIVE AIRSPACE ANALYTICS</span>
      </div>

      <Navbar activeTool={activeTool} onToolSelect={setActiveTool} />
      <RegionSelector onShowFlights={handleRegionSubmit} />

      {/* NEW PROPS PASSED TO LEFT PANEL */}
      <LeftPanel 
        activeTool={activeTool} 
        onClose={() => { setActiveTool('radar'); setActiveArc(null); }} 
        airports={airports}
        onDrawArc={setActiveArc}
      />

      <div style={{ width: '100%', height: '100%' }}>
        <GlobeWidget 
          ref={globeRef} 
          flights={flights} 
          onFlightClick={handleFlightClick} 
          airports={airports} 
          onAirportClick={handleAirportClick} 
          activeArc={activeArc} // NEW PROP PASSED TO GLOBE
        />
      </div>

      {selectedFlightData && <FlightDetailsCard flightData={selectedFlightData} onClose={() => setSelectedFlightData(null)} />}
      {selectedAirportData && <AirportDetailsCard airport={selectedAirportData} onClose={() => setSelectedAirportData(null)} />}

    </div>
  );
}

export default App;