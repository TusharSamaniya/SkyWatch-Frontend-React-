import React, { useState, useEffect } from 'react';
import GlobeWidget from './components/GlobeWidget';
import FlightDetailsCard from './components/FlightDetailsCard';
import Navbar from './components/Navbar';
import { fetchLiveFlights, fetchFlightRoute } from './api/flightApi';

function App() {
  // State to hold the massive array of all planes in India
  const [flights, setFlights] = useState([]);
  
  // State to hold the specific radar & schedule data when a single plane is clicked
  const [selectedFlightData, setSelectedFlightData] = useState(null); 

  // Fetch all live flights on initial load, and update every 60 seconds
  useEffect(() => {
    const getFlights = async () => {
      try {
        const data = await fetchLiveFlights();
        if (data) {
          setFlights(data);
        }
      } catch (error) {
        console.error("Failed to load flights:", error);
      }
    };
    
    getFlights(); // Initial fetch
    
    const intervalId = setInterval(getFlights, 60000); // 60-second timer
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Triggered exactly when a user clicks a yellow airplane icon on the globe
  const handleFlightClick = async (point) => {
    try {
      console.log(`Fetching deep-dive data for ${point.callsign}...`);
      
      // Hit our new Spring Boot /api/flights/{callsign} endpoint
      const combinedData = await fetchFlightRoute(point.callsign);
      
      // Save the returned JSON (which contains .radar and .schedule) into state.
      // This automatically makes the FlightDetailsCard slide into view!
      setSelectedFlightData(combinedData); 
    } catch (error) {
      console.error("Error fetching specific flight details:", error);
    }
  };

  return (
    // Main App Shell: Locks the screen size, prevents scrolling, sets dark theme
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0b0f1a', overflow: 'hidden', position: 'relative' }}>
      
      {/* 1. The Top Navigation Bar (Fixed at the top) */}
      <Navbar />

      {/* 2. The Main Stage / Globe Area 
          Padding-top is 65px so it sits perfectly underneath the Navbar */}
      <div style={{ paddingTop: '65px', width: '100%', height: '100%' }}>
        <GlobeWidget flights={flights} onFlightClick={handleFlightClick} />
      </div>

      {/* 3. The Sliding Information Panel 
          This only renders if 'selectedFlightData' is NOT null */}
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