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
  const [activeArc, setActiveArc] = useState(null); 
  const [activeAirline, setActiveAirline] = useState(null); 
  
  // NEW: Store the user's physical location
  const [userLocation, setUserLocation] = useState(null); 
  
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
    setActiveArc(null); 
    setActiveAirline(null); 
    setUserLocation(null);

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

  // NEW: Get User Location from Browser
  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        
        // Spin the globe to zoom in on the user!
        if (globeRef.current) {
          globeRef.current.pointOfView({ lat: position.coords.latitude, lng: position.coords.longitude, altitude: 1.2 }, 2000);
        }
      }, () => {
        alert("Please allow location access in your browser to use the Nearby Radar.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // NEW: The Haversine Formula (Calculates distance between two GPS points in Kilometers)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // UPDATED: Filter flights based on Airline OR Nearby 200km radius
  const displayedFlights = (() => {
    if (activeTool === 'airline' && activeAirline) {
      return flights.filter(flight => {
        if (flight.airline_iata === activeAirline) return true;
        if (flight.flight_iata && flight.flight_iata.startsWith(activeAirline)) return true;
        return false;
      });
    }
    if (activeTool === 'nearby' && userLocation) {
      return flights.filter(f => getDistance(userLocation.lat, userLocation.lng, f.latitude, f.longitude) <= 200);
    }
    return flights;
  })();

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0b0f1a', overflow: 'hidden', position: 'relative' }}>
      
      <div style={{ position: 'absolute', top: '25px', left: '30px', zIndex: 1000, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
        <span style={{ fontSize: '24px', fontWeight: '900', color: '#ffba00', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>SkyWatch</span>
        <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '1.5px', textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}>LIVE AIRSPACE ANALYTICS</span>
      </div>

      <Navbar activeTool={activeTool} onToolSelect={setActiveTool} />
      <RegionSelector onShowFlights={handleRegionSubmit} />

      <LeftPanel 
        activeTool={activeTool} 
        onClose={() => { setActiveTool('radar'); setActiveArc(null); setUserLocation(null); }} 
        airports={airports}
        
        // Pass the already filtered flights down to the panel!
        flights={displayedFlights} 
        
        onDrawArc={setActiveArc}
        activeAirline={activeAirline}
        onAirlineSelect={setActiveAirline}
        
        // NEW PROPS
        userLocation={userLocation}
        onDetectLocation={handleDetectLocation}
      />

      <div style={{ width: '100%', height: '100%' }}>
        <GlobeWidget 
          ref={globeRef} 
          flights={displayedFlights} 
          onFlightClick={handleFlightClick} 
          airports={airports} 
          onAirportClick={handleAirportClick} 
          activeArc={activeArc} 
          activeTool={activeTool} 
          
          // NEW PROP
          userLocation={userLocation} 
        />
      </div>

      {selectedFlightData && <FlightDetailsCard flightData={selectedFlightData} onClose={() => setSelectedFlightData(null)} />}
      {selectedAirportData && <AirportDetailsCard airport={selectedAirportData} onClose={() => setSelectedAirportData(null)} />}

    </div>
  );
}

export default App;