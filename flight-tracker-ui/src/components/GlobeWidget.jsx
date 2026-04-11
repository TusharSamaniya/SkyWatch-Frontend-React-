import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeWidget = ({ flights, onFlightClick }) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);

    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 28.6, lng: 77.2, altitude: 0.8 }, 4000);
    }
  }, []);

  return (
    <Globe
      ref={globeEl}
      backgroundColor="#0b0f1a"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      polygonsData={countries.features}
      polygonAltitude={0.01}
      polygonCapColor={() => '#1e293b'} 
      polygonSideColor={() => 'rgba(0,0,0,0)'}
      polygonStrokeColor={() => '#ffffff'}

      // ==========================================
      // LAYER 1: INVISIBLE HIT-BOXES (For Clicks & Tooltips)
      // ==========================================
      pointsData={flights}
      pointLat={(d) => d.latitude}
      pointLng={(d) => d.longitude}
      
      // FIX: Divided by 300,000 to fix the giant spikes and make them hover beautifully!
      pointAltitude={(d) => d.altitude ? d.altitude / 300000 : 0.02} 
      
      // Make the dot almost completely transparent, but keep the hit-box large
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
        
        // We subtract 45 degrees because the raw SVG image points top-right natively
        const rotation = d.trueTrack ? d.trueTrack - 45 : 0;
        
        // Inject a crisp, yellow SVG airplane
        el.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20" style="fill: #ffcc00; transform: rotate(${rotation}deg); filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.8));">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        `;
        
        // Crucial: Tell the browser to ignore clicks on the HTML image, 
        // allowing the mouse to "click through" to the invisible WebGL dot underneath!
        el.style.pointerEvents = 'none'; 
        return el;
      }}
    />
  );
};

export default GlobeWidget;