import React, { useState, useEffect } from 'react';
import { fetchAirportSchedule } from '../api/flightApi';

const AirportDetailsCard = ({ airport, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [schedule, setSchedule] = useState({ arrivals: [], departures: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the massive live schedule when the airport is clicked
  useEffect(() => {
    if (!airport || !airport.iata) return;

    const getSchedule = async () => {
      setIsLoading(true);
      const data = await fetchAirportSchedule(airport.iata);
      setSchedule(data);
      setIsLoading(false);
    };

    getSchedule();
  }, [airport]);

  if (!airport) return null;

  // Helper to format timestamps (AirLabs format: "YYYY-MM-DD HH:MM")
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    return timeString.split(' ') || timeString;
  };

  // Shared Styles for Tabs
  const tabStyle = (isActive) => ({
    flex: 1,
    padding: '10px',
    background: isActive ? '#10b981' : '#1f2937',
    color: isActive ? '#000' : '#9ca3af',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  });

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '450px',
      height: '100vh', background: '#111827', borderLeft: '1px solid #374151',
      padding: '20px', color: 'white', zIndex: 1000, overflowY: 'auto',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', boxSizing: 'border-box'
    }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#10b981' }}>
            <span style={{ fontSize: '20px', marginRight: '10px' }}>🏙️</span>
            {airport.iata} • {airport.name}
          </h2>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>
            Coordinates: {airport.lat.toFixed(4)}, {airport.lng.toFixed(4)}
          </div>
        </div>
        <button onClick={onClose} style={{ background: '#1f2937', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>✖</button>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button style={tabStyle(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>
          ℹ️ Overview
        </button>
        <button style={tabStyle(activeTab === 'arr')} onClick={() => setActiveTab('arr')}>
          ⬇️ Arr ({schedule.arrivals.length})
        </button>
        <button style={tabStyle(activeTab === 'dep')} onClick={() => setActiveTab('dep')}>
          ⬆️ Dep ({schedule.departures.length})
        </button>
      </div>

      {/* CONTENT AREA */}
      <div style={{ background: '#1f2937', borderRadius: '10px', padding: '15px', minHeight: '300px' }}>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#10b981', padding: '50px 0' }}>
            Downloading Live Timetable...
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ background: '#111827', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', color: '#10b981', fontWeight: 'bold' }}>{schedule.arrivals.length + schedule.departures.length}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Total Active Flights</div>
                </div>
                <div style={{ background: '#111827', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', color: '#ffba00', fontWeight: 'bold' }}>Live</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Radar Status</div>
                </div>
              </div>
            )}

            {/* ARRIVALS TAB */}
            {activeTab === 'arr' && (
              <div>
                {schedule.arrivals.slice(0, 50).map((flight, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #374151' }}>
                    <div style={{ color: '#10b981', fontWeight: 'bold', width: '80px' }}>{flight.flight_iata || flight.flight_number}</div>
                    <div style={{ flex: 1, color: '#e5e7eb' }}>From: {flight.dep_iata || 'Unknown'}</div>
                    <div style={{ width: '60px', textAlign: 'right', color: '#9ca3af' }}>{formatTime(flight.arr_time)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* DEPARTURES TAB */}
            {activeTab === 'dep' && (
              <div>
                {schedule.departures.slice(0, 50).map((flight, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #374151' }}>
                    <div style={{ color: '#ffba00', fontWeight: 'bold', width: '80px' }}>{flight.flight_iata || flight.flight_number}</div>
                    <div style={{ flex: 1, color: '#e5e7eb' }}>To: {flight.arr_iata || 'Unknown'}</div>
                    <div style={{ width: '60px', textAlign: 'right', color: '#9ca3af' }}>{formatTime(flight.dep_time)}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AirportDetailsCard;