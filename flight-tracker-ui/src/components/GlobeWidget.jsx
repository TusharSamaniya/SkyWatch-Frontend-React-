import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeWidget = ({ flights }) => {
  const globeEl = useRef();

  // This runs once when the globe loads to point the camera at India
  useEffect(() => {
    if (globeEl.current) {
      // Coordinates for New Delhi, altitude sets how zoomed out we are
      globeEl.current.pointOfView({ lat: 20, lng: 77, altitude: 1.5 }, 4000);
      
      // Slowly rotate the Earth automatically
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <Globe
      ref={globeEl}
      // The High-Res Dark Theme Textures
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      
      // Feed your Spring Boot data here!
      pointsData={flights}
      pointLat={(d) => d.latitude}
      pointLng={(d) => d.longitude}
      
      // Make planes hover based on real altitude! (Divided by a large number to scale it for the globe)
      pointAltitude={(d) => d.altitude ? d.altitude / 30000 : 0.01} 
      
      // Styling the flight markers
      pointColor={() => '#ffcc00'} // Aviation orange/yellow
      pointRadius={0.15}
      
      // What happens when you hover over a plane
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