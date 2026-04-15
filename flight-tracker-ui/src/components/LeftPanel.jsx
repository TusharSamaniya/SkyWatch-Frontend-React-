import React, { useState, useEffect } from 'react';
import { fetchRoutes, fetchAirlines } from '../api/flightApi';

// NEW: We added 'flights' to the props so the Left Panel can analyze the live radar data!
const LeftPanel = ({ activeTool, onClose, airports, flights = [], onDrawArc, onAirlineSelect, activeAirline }) => {
  const [depIata, setDepIata] = useState('DEL');
  const [arrIata, setArrIata] = useState('BOM');
  const [routes, setRoutes] = useState([]);
  
  const [airlines, setAirlines] = useState([]);
  const [airlineSearch, setAirlineSearch] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTool === 'airline' && airlines.length === 0) {
      const getAirlines = async () => {
        setIsLoading(true);
        const data = await fetchAirlines();
        setAirlines(data || []);
        setIsLoading(false);
      };
      getAirlines();
    }
  }, [activeTool, airlines.length]);

  if (!activeTool || activeTool === 'radar') return null;

  const toolTitles = {
    route: '🗺️ Route Intelligence',
    airline: '✈️ Airline Fleet Tracker',
    delays: '⚠️ Live Delay Board',
    nearby: '📍 Nearby Airspace Radar'
  };

  const handleRouteSearch = async () => {
    setIsLoading(true);
    setRoutes([]);
    const data = await fetchRoutes(depIata, arrIata);
    setRoutes(data || []);
    setIsLoading(false);
  };

  const handleRouteClick = () => {
    const startAirport = airports.find(a => a.iata === depIata.toUpperCase());
    const endAirport = airports.find(a => a.iata === arrIata.toUpperCase());

    if (startAirport && endAirport) {
      onDrawArc({
        startLat: startAirport.lat, startLng: startAirport.lng,
        endLat: endAirport.lat, endLng: endAirport.lng
      });
    } else {
      alert("Please ensure the green airport dots have loaded on the map first!");
    }
  };

  const filteredAirlines = (airlines || [])
    .filter(a => a.name.toLowerCase().includes(airlineSearch.toLowerCase()) || a.iata.toLowerCase().includes(airlineSearch.toLowerCase()))
    .slice(0, 50);

  // NEW: Delay Board Logic! Filter flights delayed more than 15 mins, and sort them highest to lowest.
  const delayedFlightsList = flights
    .filter(f => f.delayed && f.delayed > 15)
    .sort((a, b) => b.delayed - a.delayed)
    .slice(0, 50); // Show top 50 worst delays

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', maxWidth: '400px', height: '100vh', 
      background: '#111827', borderRight: '1px solid #374151', padding: '20px', 
      color: 'white', zIndex: 900, overflowY: 'auto', boxShadow: '10px 0 30px rgba(0,0,0,0.5)', 
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
    }}>
      
      <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #374151' }}>
        <h2 style={{ margin: 0, fontSize: '22px', color: '#ffba00' }}>{toolTitles[activeTool]}</h2>
        <button onClick={onClose} style={{ background: '#1f2937', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>✖</button>
      </div>

      {/* ========================================= */}
      {/* TOOL 1: ROUTE INTELLIGENCE */}
      {/* ========================================= */}
      {activeTool === 'route' && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input 
              value={depIata} onChange={(e) => setDepIata(e.target.value.toUpperCase())} placeholder="Origin"
              style={{ flex: 1, background: '#1f2937', border: '1px solid #374151', color: 'white', padding: '10px', borderRadius: '5px', textTransform: 'uppercase' }} 
            />
            <span style={{ paddingTop: '10px', color: '#9ca3af' }}>➔</span>
            <input 
              value={arrIata} onChange={(e) => setArrIata(e.target.value.toUpperCase())} placeholder="Dest"
              style={{ flex: 1, background: '#1f2937', border: '1px solid #374151', color: 'white', padding: '10px', borderRadius: '5px', textTransform: 'uppercase' }} 
            />
          </div>
          <button onClick={handleRouteSearch} style={{ width: '100%', background: '#ffba00', color: 'black', fontWeight: 'bold', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
            {isLoading ? "Scanning Frequencies..." : "Search Routes"}
          </button>
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TOOL 2: AIRLINE FLEET TRACKER */}
      {/* ========================================= */}
      {activeTool === 'airline' && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '15px' }}>
            Isolate specific airlines to view their active global fleet.
          </p>
          <input 
            type="text" placeholder="Search Airline (e.g., IndiGo, Emirates)" 
            value={airlineSearch} onChange={(e) => setAirlineSearch(e.target.value)}
            style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', color: 'white', padding: '12px', borderRadius: '5px', marginBottom: '20px', boxSizing: 'border-box' }}
          />
          {isLoading ? (
            <div style={{ color: '#ffba00', textAlign: 'center', marginTop: '20px' }}>Downloading Global Fleet DB...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => onAirlineSelect(null)} style={{ background: activeAirline === null ? '#10b981' : '#1f2937', color: activeAirline === null ? 'black' : 'white', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'left' }}>
                🌍 Show All Airlines
              </button>
              {filteredAirlines.map((airline, idx) => (
                <button key={idx} onClick={() => onAirlineSelect(airline.iata)} style={{ background: activeAirline === airline.iata ? '#ffba00' : '#111827', color: activeAirline === airline.iata ? 'black' : '#e5e7eb', border: '1px solid #374151', padding: '12px', borderRadius: '5px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>{airline.name}</span>
                  <span style={{ color: activeAirline === airline.iata ? 'black' : '#9ca3af', fontSize: '12px' }}>{airline.iata}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================= */}
      {/* TOOL 3: LIVE DELAY BOARD */}
      {/* ========================================= */}
      {activeTool === 'delays' && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '15px' }}>
            Real-time tracker of the most delayed flights currently in the air.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {delayedFlightsList.length === 0 ? (
              <div style={{ color: '#10b981', textAlign: 'center', padding: '20px', background: '#1f2937', borderRadius: '8px' }}>
                ✅ No significant delays detected in this region right now!
              </div>
            ) : (
              delayedFlightsList.map((flight, idx) => (
                <div key={idx} style={{ background: '#1f2937', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ef4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#f87171', fontSize: '16px' }}>
                      {flight.airline_iata || ''} {flight.flight_number || flight.callsign}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                      {flight.dep_iata || '?'} ➔ {flight.arr_iata || '?'}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '8px 12px', borderRadius: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                    +{flight.delayed} mins
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default LeftPanel;