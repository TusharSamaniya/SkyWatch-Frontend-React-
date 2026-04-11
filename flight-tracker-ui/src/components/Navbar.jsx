import React from 'react';

const Navbar = () => {
  return (
    <div style={{
      height: '65px', width: '100%', background: '#0b0f19', 
      borderBottom: '1px solid #1f2937', display: 'flex', 
      alignItems: 'center', padding: '0 30px', color: 'white', 
      position: 'fixed', top: 0, left: 0, zIndex: 100,
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      {/* Brand / Logo Area */}
      <div style={{ display: 'flex', flexDirection: 'column', marginRight: '60px' }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffba00' }}>Aviation Intelligence</span>
        <span style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '1px' }}>LIVE INDIA AIRSPACE ANALYTICS</span>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '30px', fontSize: '14px', fontWeight: '500' }}>
        {/* Active Tab */}
        <div style={{ color: '#ffba00', borderBottom: '3px solid #ffba00', height: '65px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          Live Ops
        </div>
        {/* Inactive Tabs (For future features) */}
        <div style={{ color: '#9ca3af', height: '65px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>Delay Prediction</div>
        <div style={{ color: '#9ca3af', height: '65px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>Airport Traffic</div>
        <div style={{ color: '#9ca3af', height: '65px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>Passenger View</div>
      </div>
    </div>
  );
};

export default Navbar;