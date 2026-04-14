import React, { useState, useEffect } from 'react';
import { fetchFlightStory } from '../api/flightApi';

const FlightStoryOverlay = ({ flightData, onClose }) => {
  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { radar, schedule, photo } = flightData;

  useEffect(() => {
    const getStory = async () => {
      // Extract the details to send to the AI
      const callsign = radar.callsign || "Unknown";
      const dep = schedule?.dep_iata || "Unknown";
      const arr = schedule?.arr_iata || "Unknown";
      const aircraft = radar.aircraft_code || "Commercial";
      const alt = radar.altitude ? Math.round(radar.altitude * 3.28084) : 0; // Convert to feet

      // Fetch from your new Spring Boot endpoint!
      const aiStory = await fetchFlightStory(callsign, dep, arr, aircraft, alt);
      setStory(aiStory);
      setIsLoading(false);
    };

    getStory();
  }, [flightData]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(11, 15, 26, 0.95)',
      backdropFilter: 'blur(15px)',
      zIndex: 2000, // Make sure it sits above EVERYTHING
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      boxSizing: 'border-box',
      color: 'white',
      overflowY: 'auto'
    }}>
      
      {/* Close Button */}
      <button 
        onClick={onClose} 
        style={{
          position: 'absolute',
          top: '30px',
          right: '40px',
          background: 'none',
          border: '2px solid #374151',
          color: 'white',
          fontSize: '24px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.target.style.background = '#1f2937'}
        onMouseOut={(e) => e.target.style.background = 'none'}
      >
        ✖
      </button>

      <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', color: '#ffba00', marginBottom: '10px', textTransform: 'uppercase' }}>
          {radar.callsign}
        </h1>
        <h2 style={{ fontSize: '18px', color: '#9ca3af', letterSpacing: '2px', marginBottom: '40px' }}>
          {schedule?.dep_name || schedule?.dep_iata || 'Unknown Origin'} ➔ {schedule?.arr_name || schedule?.arr_iata || 'Unknown Destination'}
        </h2>

        {/* Large Cinematic Photo */}
        <div style={{ 
          width: '100%', 
          height: '400px', 
          backgroundColor: '#1f2937', 
          borderRadius: '15px', 
          overflow: 'hidden',
          marginBottom: '40px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {photo ? (
            <img src={photo} alt="Aircraft" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#6b7280', fontSize: '18px' }}>No Photographic Record Available</span>
          )}
        </div>

        {/* The AI Story Box */}
        <div style={{
          backgroundColor: '#1f2937',
          padding: '40px',
          borderRadius: '15px',
          borderLeft: '5px solid #ffba00',
          textAlign: 'left',
          fontSize: '20px',
          lineHeight: '1.8',
          color: '#e5e7eb'
        }}>
          {isLoading ? (
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffba00', fontStyle: 'italic' }}>
               <span style={{ fontSize: '24px', marginRight: '15px' }}>✈️</span> 
               Azure AI is analyzing telemetry data...
             </div>
          ) : (
            <p style={{ margin: 0 }}>{story}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightStoryOverlay;