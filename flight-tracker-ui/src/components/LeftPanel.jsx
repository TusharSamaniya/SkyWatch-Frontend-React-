import React, { useState } from 'react';
import { fetchRoutes } from '../api/flightApi';

const LeftPanel = ({ activeTool, onClose, airports, onDrawArc }) => {
  const [depIata, setDepIata] = useState('DEL');
  const [arrIata, setArrIata] = useState('BOM');
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!activeTool || activeTool === 'radar') return null;

  const handleSearch = async () => {
    setIsLoading(true);
    setRoutes([]);
    const data = await fetchRoutes(depIata, arrIata);
    setRoutes(data);
    setIsLoading(false);
  };

  const handleRouteClick = () => {
    // Find the exact coordinates of the two airports from our existing map data!
    const startAirport = airports.find(a => a.iata === depIata.toUpperCase());
    const endAirport = airports.find(a => a.iata === arrIata.toUpperCase());

    if (startAirport && endAirport) {
      onDrawArc({
        startLat: startAirport.lat,
        startLng: startAirport.lng,
        endLat: endAirport.lat,
        endLng: endAirport.lng
      });
    } else {
      alert("Please ensure the green airport dots have loaded on the map first!");
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', maxWidth: '400px', height: '100vh', 
      background: '#111827', borderRight: '1px solid #374151', padding: '20px', 
      color: 'white', zIndex: 900, overflowY: 'auto', boxShadow: '10px 0 30px rgba(0,0,0,0.5)', 
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
    }}>
      
      <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #374151' }}>
        <h2 style={{ margin: 0, fontSize: '22px', color: '#ffba00' }}>🗺️ Route Intelligence</h2>
        <button onClick={onClose} style={{ background: '#1f2937', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>✖</button>
      </div>

      {activeTool === 'route' && (
        <div style={{ marginTop: '20px' }}>
          {/* SEARCH CONTROLS */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input 
              value={depIata} onChange={(e) => setDepIata(e.target.value.toUpperCase())}
              placeholder="Origin (e.g., DEL)"
              style={{ flex: 1, background: '#1f2937', border: '1px solid #374151', color: 'white', padding: '10px', borderRadius: '5px', textTransform: 'uppercase' }} 
            />
            <span style={{ paddingTop: '10px', color: '#9ca3af' }}>➔</span>
            <input 
              value={arrIata} onChange={(e) => setArrIata(e.target.value.toUpperCase())}
              placeholder="Dest (e.g., BOM)"
              style={{ flex: 1, background: '#1f2937', border: '1px solid #374151', color: 'white', padding: '10px', borderRadius: '5px', textTransform: 'uppercase' }} 
            />
          </div>
          
          <button onClick={handleSearch} style={{ width: '100%', background: '#ffba00', color: 'black', fontWeight: 'bold', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
            {isLoading ? "Scanning Frequencies..." : "Search Routes"}
          </button>

          {/* RESULTS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {routes.length > 0 && (
              <button onClick={handleRouteClick} style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                🌐 DRAW ROUTE ON 3D MAP
              </button>
            )}

            {routes.map((route, idx) => (
              <div key={idx} style={{ background: '#1f2937', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>{route.airline_iata} {route.flight_number}</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af', background: '#111827', padding: '2px 8px', borderRadius: '10px' }}>{route.duration} mins</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span><span style={{ color: '#9ca3af' }}>Dep:</span> {route.dep_time}</span>
                  <span><span style={{ color: '#9ca3af' }}>Arr:</span> {route.arr_time}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '10px', textTransform: 'uppercase' }}>
                  Runs: {route.days?.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftPanel;