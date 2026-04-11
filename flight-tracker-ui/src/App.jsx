import { useEffect, useState } from 'react'
import { fetchLiveFlights, fetchFlightRoute } from './api/flightApi'
import GlobeWidget from './components/GlobeWidget'
import FlightDetailsCard from './components/FlightDetailsCard'

function App() {
  const [flights, setFlights] = useState([]);
  
  // Memory for the interaction
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);

  useEffect(() => {
    const getFlights = async () => {
      const liveData = await fetchLiveFlights();
      setFlights(liveData);
    };
    getFlights();
  }, []);

  // The magic function that fires when you click a plane!
  const handleFlightClick = async (flight) => {
    setSelectedFlight(flight); // Show the radar stats immediately
    setRouteDetails(null);     // Clear out the old route details
    
    // Ask Spring Boot for the Aviationstack data
    if (flight.callsign) {
      const details = await fetchFlightRoute(flight.callsign);
      setRouteDetails(details);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      
      {/* Left HUD */}
      <div style={{ 
        position: 'absolute', top: '20px', left: '20px', zIndex: 10,
        background: 'rgba(11, 15, 26, 0.8)', padding: '15px 25px', 
        borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>🌍 Aviation Intelligence</h1>
        <p style={{ margin: 0, color: '#aaa' }}>
          Active Flights Tracking: <span style={{ color: '#ffcc00', fontWeight: 'bold' }}>{flights.length}</span>
        </p>
      </div>

      {/* Right HUD - The Flight Details Card */}
      <FlightDetailsCard 
        flight={selectedFlight} 
        route={routeDetails} 
        onClose={() => setSelectedFlight(null)} 
      />

      <GlobeWidget 
        flights={flights} 
        onFlightClick={handleFlightClick} // Pass the click function down to the globe
      />
    </div>
  )
}

export default App