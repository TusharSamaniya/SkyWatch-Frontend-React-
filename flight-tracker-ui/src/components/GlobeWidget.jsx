import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeWidget = ({ flights }) => {
  const globeEl = useRef();
  
  // NEW: Create a memory space to hold the math geometry for country borders
  const [countries, setCountries] = useState({ features: [] });

  useEffect(() => {
    // NEW: Reach out to the internet and download the official World Borders GeoJSON file
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);

    if (globeEl.current) {
      // FIX 5: Focus on Northern India right from the start!
      // Lat 28.6 and Lng 77.2 is New Delhi. Altitude 0.8 zooms us in nicely.
      globeEl.current.pointOfView({ lat: 28.6, lng: 77.2, altitude: 0.8 }, 4000);

      // FIX 1: We completely deleted the "autoRotate" code here. 
      // The globe will now sit perfectly still until you drag it!
    }
  }, []);

  return (
    <Globe
      ref={globeEl}
      backgroundColor="#0b0f1a"
      
      // FIX 2: We use a dark satellite image for the water...
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"

      // ...and we draw 3D polygons over the land to create extreme contrast!
      polygonsData={countries.features}
      polygonAltitude={0.01} // Float the land slightly above the water
      polygonCapColor={() => '#1e293b'} // FIX 2: Paint all land a clean, solid Dark Slate Grey
      polygonSideColor={() => 'rgba(0,0,0,0)'}
      polygonStrokeColor={() => '#ffffff'} // FIX 4: Paint all country borders pure white so they pop!

      // --- FLIGHT DATA (Unchanged) ---
      pointsData={flights}
      pointLat={(d) => d.latitude}
      pointLng={(d) => d.longitude}
      pointAltitude={(d) => d.altitude ? d.altitude / 30000 : 0.02} 
      pointColor={() => '#ffcc00'}
      pointRadius={0.12} // Made the dots slightly smaller since we are zoomed in
      pointLabel={(d) => `
        <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 5px; color: white;">
          <b>Flight: ${d.callsign || 'Unknown'}</b><br/>
          Altitude: ${d.altitude}m<br/>
          Speed: ${d.velocity} m/s
        </div>
      `}
    />
  );
};

export default GlobeWidget;