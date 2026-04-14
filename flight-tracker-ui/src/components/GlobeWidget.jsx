import React, { useEffect, useState, forwardRef } from 'react';
import Globe from 'react-globe.gl';

// NEW: Added 'airports' and 'onAirportClick' to the props
const GlobeWidget = forwardRef(({ flights, onFlightClick, airports, onAirportClick }, ref) => {
  const [countries, setCountries] = useState({ features: [] });

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);

    // Initial spin when the app first loads
    if (ref && ref.current) {
      ref.current.pointOfView({ lat: 28.6, lng: 77.2, altitude: 0.8 }, 4000);
    }
  }, [ref]);

  return (
    <Globe
      ref={ref} 
      backgroundColor="#0b0f1a"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      polygonsData={countries.features}
      polygonAltitude={0.01}
      polygonCapColor={() => '#1e293b'} 
      polygonSideColor={() => 'rgba(0,0,0,0)'}
      polygonStrokeColor={() => '#ffffff'}

      // ==========================================
      // LAYER 1: INVISIBLE HIT-BOXES (For Flights)
      // ==========================================
      pointsData={flights}
      pointLat={(d) => d.latitude}
      pointLng={(d) => d.longitude}
      pointAltitude={(d) => d.altitude ? d.altitude / 300000 : 0.02} 
      pointColor={() => 'rgba(255, 204, 0, 0.01)'} 
      pointRadius={0.4} 
      onPointClick={(point) => onFlightClick(point)} 
      pointLabel={(d) => `
        <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 5px; color: white; border: 1px solid #ffcc00;">
          <b>Flight: ${d.callsign || 'Unknown'}</b><br/>
          Altitude: ${d.altitude}m<br/>
          Speed: ${d.velocity} km/h
        </div>
      `}

      // ==========================================
      // LAYER 2: THE AIRPLANE ICONS (Visuals Only)
      // ==========================================
      htmlElementsData={flights}
      htmlLat={(d) => d.latitude}
      htmlLng={(d) => d.longitude}
      htmlAltitude={(d) => d.altitude ? d.altitude / 300000 : 0.02}
      htmlElement={(d) => {
        const el = document.createElement('div');
        const rotation = d.trueTrack ? d.trueTrack - 45 : 0;
        el.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" style="fill: #ffcc00; transform: rotate(${rotation}deg); filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.8));">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        `;
        el.style.pointerEvents = 'none'; 
        return el;
      }}

      // ==========================================
      // LAYER 3: NEW AIRPORT LAYER (Green Dots + IATA Text)
      // ==========================================
      labelsData={airports}
      labelLat={(d) => d.lat}
      labelLng={(d) => d.lng}
      labelText={(d) => d.iata} // Shows the airport code (e.g., DEL, BOM)
      labelSize={0.6} // Size of the text
      labelDotRadius={0.3} // Size of the green dot
      labelColor={() => '#10b981'} // Bright Emerald Green
      labelAltitude={0.015} // Sits slightly above the map
      onLabelClick={(airport) => onAirportClick(airport)} // Triggers the panel!
      labelLabel={(d) => `
        <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 5px; color: white; border: 1px solid #10b981;">
          <b>${d.iata} - ${d.name}</b><br/>
          Click to view live timetable
        </div>
      `}
    />
  );
});

export default GlobeWidget;