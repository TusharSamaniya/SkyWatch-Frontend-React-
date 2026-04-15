import React from 'react';

const Navbar = ({ activeTool, onToolSelect }) => {
  const navItems = [
    { id: 'radar', label: '📡 Live Radar' }, // Default view
    { id: 'route', label: '🗺️ Route Intelligence' },
    { id: 'airline', label: '✈️ Airline Fleet' },
    { id: 'delays', label: '⚠️ Delay Board' },
    { id: 'nearby', label: '📍 Nearby Airspace' }
  ];

  return (
    <div style={{
      position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: '10px', background: '#111827', padding: '10px 20px',
      borderRadius: '12px', zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      border: '1px solid #374151'
    }}>
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onToolSelect(item.id === activeTool ? 'radar' : item.id)}
          style={{
            background: activeTool === item.id ? '#ffba00' : 'transparent',
            color: activeTool === item.id ? '#000' : '#9ca3af',
            border: 'none', padding: '8px 16px', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Navbar;