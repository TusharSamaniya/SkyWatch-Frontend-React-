import React from 'react';

const LeftPanel = ({ activeTool, onClose }) => {
  // Do not show the panel if no tool is selected, or if the default "radar" is active
  if (!activeTool || activeTool === 'radar') return null; 

  const toolTitles = {
    route: 'Route Intelligence',
    airline: 'Airline Fleet Tracker',
    delays: 'Live Delay Board',
    nearby: 'Nearby Airspace Radar'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', maxWidth: '400px',
      height: '100vh', background: '#111827', borderRight: '1px solid #374151',
      padding: '20px', color: 'white', zIndex: 900, overflowY: 'auto',
      boxShadow: '10px 0 30px rgba(0,0,0,0.5)', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column'
    }}>
      
      {/* We add margin-top so it doesn't cover your SkyWatch logo! */}
      <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #374151' }}>
        <h2 style={{ margin: 0, fontSize: '22px', color: '#ffba00' }}>
          {toolTitles[activeTool]}
        </h2>
        <button onClick={onClose} style={{ background: '#1f2937', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>✖</button>
      </div>

      <div style={{ marginTop: '30px', color: '#9ca3af', textAlign: 'center', padding: '40px 20px', background: '#1f2937', borderRadius: '10px' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🚧</div>
        <h3>Module Loading</h3>
        <p style={{ fontSize: '14px' }}>This tool is currently being wired to the AirLabs API. (Phase 2)</p>
      </div>

    </div>
  );
};

export default LeftPanel;