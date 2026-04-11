import React from 'react';

const FlightDetailsCard = ({ flightData, onClose }) => {
  // Wait until we actually have the combined data from Spring Boot
  if (!flightData || !flightData.radar) return null;

  const { radar, schedule } = flightData;

  // Simple math to format the altitude and speed nicely
  const formattedAlt = Math.round(radar.altitude * 3.28084); // Convert meters to feet
  const formattedSpeed = Math.round(radar.velocity * 0.539957); // Convert km/h to knots

  return (
    <div style={{
      position: 'fixed', top: '65px', right: 0, width: '380px', height: 'calc(100vh - 65px)',
      background: '#111827', borderLeft: '1px solid #374151', padding: '20px', 
      color: 'white', zIndex: 50, overflowY: 'auto',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
    }}>
      
      {/* Close Button & Callsign */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', color: '#ffba00' }}>✈ {radar.callsign}</h2>
        <button onClick={onClose} style={{ background: '#1f2937', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Close ✖</button>
      </div>

      {/* Image Placeholder (We will fill this in Phase 3!) */}
      <div style={{ 
        height: '180px', background: '#1f2937', borderRadius: '10px', 
        marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px dashed #4b5563'
      }}>
        <span style={{ color: '#6b7280' }}>Aircraft Photo Space</span>
      </div>

      {/* The Route Timetable (From AirLabs Schedule) */}
      {schedule ? (
        <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Flight Plan</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        </div>
      ) : (
        <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', color: '#9ca3af' }}>
          Schedule data unavailable for this flight.
        </div>
      )}

      {/* Live Radar Telemetry */}
      <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>Live Radar Telemetry</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Altitude</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{formattedAlt} <span style={{fontSize:'12px', fontWeight:'normal'}}>ft</span></div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Ground Speed</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{formattedSpeed} <span style={{fontSize:'12px', fontWeight:'normal'}}>kts</span></div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Heading</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{radar.trueTrack}°</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Coordinates</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{radar.latitude.toFixed(2)}, {radar.longitude.toFixed(2)}</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FlightDetailsCard;