import React from 'react';

const FlightDetailsCard = ({ flight, route, onClose }) => {
  if (!flight) return null; // Don't show the card if no flight is clicked

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '320px',
      background: 'rgba(11, 15, 26, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: '12px',
      padding: '20px',
      color: 'white',
      zIndex: 20,
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      {/* Header with Close Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#ffcc00' }}>{flight.callsign}</h2>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>✖</button>
      </div>

      {/* Radar Stats (Always Available from OpenSky) */}
      <div style={{ marginBottom: '15px' }}>
        <p style={{ margin: '5px 0', fontSize: '14px' }}><b>Altitude:</b> {flight.altitude} m</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}><b>Speed:</b> {flight.velocity} m/s</p>
      </div>

      {/* Route Stats (Fetched from Aviationstack) */}
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase', color: '#888' }}>Route Details</h3>
        
        {!route ? (
          <p style={{ margin: 0, fontSize: '14px', color: '#ff6b6b' }}>
            <i>Route data currently unavailable for this regional flight.</i>
          </p>
        ) : (
          <>
            <p style={{ margin: '5px 0', fontSize: '14px' }}><b>Airline:</b> {route.airline?.name || 'Unknown'}</p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}><b>From:</b> {route.departure?.airport || 'Unknown'}</p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}><b>To:</b> {route.arrival?.airport || 'Unknown'}</p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#4ade80' }}><b>Status:</b> {route.flight_status}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FlightDetailsCard;