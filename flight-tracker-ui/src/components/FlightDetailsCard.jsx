import React, { useState, useEffect } from 'react';

const FlightDetailsCard = ({ flightData, onClose }) => {
  const [timeLeft, setTimeLeft] = useState('Calculating...');

  // This effect calculates the live countdown to landing
  useEffect(() => {
    if (!flightData || !flightData.schedule || !flightData.schedule.arr_time) return;

    const interval = setInterval(() => {
      // AirLabs gives us "YYYY-MM-DD HH:MM"
      const arrivalTime = new Date(flightData.schedule.arr_time).getTime();
      const now = new Date().getTime();
      const difference = arrivalTime - now;

      if (difference < 0) {
        setTimeLeft("Landed / Taxiing");
      } else {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [flightData]);

  if (!flightData || !flightData.radar) return null;
  const { radar, schedule, photo } = flightData;
  const formattedAlt = Math.round(radar.altitude * 3.28084); 
  const formattedSpeed = Math.round(radar.velocity * 0.539957);

  return (
    <div style={{
      position: 'fixed', 
      top: 0, 
      right: 0, 
      width: '100%',            
      maxWidth: '400px',        
      boxSizing: 'border-box',  
      height: '100vh', 
      background: '#111827', 
      borderLeft: '1px solid #374151', 
      padding: '20px', 
      color: 'white', 
      zIndex: 1000, // <--- CHANGE THIS FROM 50 TO 1000
      overflowY: 'auto', 
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#ffba00' }}>✈ {radar.callsign}</h2>
          {radar.registration && <div style={{ fontSize: '12px', color: '#9ca3af' }}>REG: {radar.registration}</div>}
        </div>
        <button onClick={onClose} style={{ background: '#1f2937', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>✖</button>
      </div>

      {/* The Actual Aircraft Photo! */}
      <div style={{ height: '180px', background: '#1f2937', borderRadius: '10px', marginBottom: '20px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {photo ? (
          <img src={photo} alt="Aircraft" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ color: '#6b7280' }}>No Photo Available</span>
        )}
      </div>

      {/* Timetable & Live Countdown */}
      {schedule ? (
        <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Flight Plan</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{schedule.dep_iata || 'N/A'}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{schedule.dep_time ? schedule.dep_time.split(' ') : '--:--'}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '0 10px' }}>
              <div style={{ borderBottom: '2px dashed #4b5563', margin: '10px 0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#1f2937', padding: '0 5px' }}>✈️</span>
              </div>
              <span style={{ fontSize: '12px', color: '#10b981' }}>{schedule.status ? schedule.status.toUpperCase() : 'LIVE'}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{schedule.arr_iata || 'N/A'}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{schedule.arr_time ? schedule.arr_time.split(' ') : '--:--'}</div>
            </div>
          </div>
          
          {/* THE LIVE COUNTDOWN */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '5px' }}>Estimated Time to Landing</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffba00', fontFamily: 'monospace' }}>{timeLeft}</div>
          </div>
        </div>
      ) : (
        <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', color: '#9ca3af' }}>
          Schedule data unavailable for this flight.
        </div>
      )}

      {/* Radar Stats... (Same as before) */}
      <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Live Radar Telemetry</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div><div style={{ fontSize: '12px', color: '#9ca3af' }}>Altitude</div><div style={{ fontSize: '18px', fontWeight: 'bold' }}>{formattedAlt} <span style={{fontSize:'12px', fontWeight:'normal'}}>ft</span></div></div>
          <div><div style={{ fontSize: '12px', color: '#9ca3af' }}>Ground Speed</div><div style={{ fontSize: '18px', fontWeight: 'bold' }}>{formattedSpeed} <span style={{fontSize:'12px', fontWeight:'normal'}}>kts</span></div></div>
          <div><div style={{ fontSize: '12px', color: '#9ca3af' }}>Heading</div><div style={{ fontSize: '18px', fontWeight: 'bold' }}>{radar.trueTrack}°</div></div>
          <div><div style={{ fontSize: '12px', color: '#9ca3af' }}>Coordinates</div><div style={{ fontSize: '14px', fontWeight: 'bold' }}>{radar.latitude.toFixed(2)}, {radar.longitude.toFixed(2)}</div></div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsCard;