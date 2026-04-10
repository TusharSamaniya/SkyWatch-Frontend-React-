import { useEffect, useState } from 'react'
import { fetchLiveFlights } from './api/flightApi'
import GlobeWidget from './components/GlobeWidget'

function App() {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const getFlights = async () => {
      const liveData = await fetchLiveFlights();
      setFlights(liveData);
    };
    getFlights();
  }, []);

  return (
    // This wrapper ensures the globe takes up the whole screen
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      
      {/* Floating UI HUD (Heads Up Display) */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 10, // Keeps the text ON TOP of the 3D globe
        background: 'rgba(11, 15, 26, 0.8)', 
        padding: '15px 25px', 
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>🌍 Aviation Intelligence</h1>
        <p style={{ margin: 0, color: '#aaa' }}>
          Active Flights Tracking: <span style={{ color: '#ffcc00', fontWeight: 'bold' }}>{flights.length}</span>
        </p>
      </div>

      {/* Render the 3D Globe and pass the data into it */}
      <GlobeWidget flights={flights} />
    </div>
  )
}

export default App