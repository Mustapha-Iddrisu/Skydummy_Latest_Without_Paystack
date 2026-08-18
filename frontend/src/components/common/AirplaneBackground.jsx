// src/components/common/AirplaneBackground.jsx

import React from 'react';

const AirplaneBackground = () => {
  return (
    <div className="airplane-bg-full" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)'
    }}>
      <svg 
        viewBox="0 0 1200 800" 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '1200px',
          height: 'auto',
          animation: 'floatBackground 30s ease-in-out infinite',
        }}
      >
        {/* Big Airplane */}
        <g transform="translate(600, 400) rotate(-5)">
          {/* Fuselage */}
          <ellipse cx="0" cy="0" rx="250" ry="40" fill="#0b2b40" opacity="0.08" />
          <ellipse cx="0" cy="0" rx="240" ry="35" fill="#0b2b40" opacity="0.12" />
          
          {/* Nose */}
          <ellipse cx="230" cy="0" rx="50" ry="20" fill="#2a7de1" opacity="0.15" />
          
          {/* Main Wings */}
          <path d="M-100,-25 L-180,-180 L-60,-40 Z" fill="#1a405a" opacity="0.10" />
          <path d="M-100,25 L-180,180 L-60,40 Z" fill="#1a405a" opacity="0.10" />
          
          {/* Wing Details */}
          <path d="M-140,-25 L-220,-150 L-100,-35 Z" fill="#2a7de1" opacity="0.08" />
          <path d="M-140,25 L-220,150 L-100,35 Z" fill="#2a7de1" opacity="0.08" />
          
          {/* Tail */}
          <path d="M-240,-15 L-320,-80 L-260,-15 Z" fill="#1a405a" opacity="0.10" />
          <path d="M-240,15 L-320,80 L-260,15 Z" fill="#1a405a" opacity="0.10" />
          <path d="M-250,-8 L-340,-8 L-290,-60 Z" fill="#0b2b40" opacity="0.08" />
          
          {/* Windows */}
          {[-160,-130,-100,-70,-40,-10,20,50,80,110,140,170].map((x) => (
            <circle key={x} cx={x} cy="-6" r="8" fill="#ffd966" opacity="0.15" />
          ))}
          
          {/* Contrails */}
          <path d="M-350,-15 Q-500,-40 -650,-25" stroke="#8aa3b5" strokeWidth="4" fill="none" opacity="0.10" />
          <path d="M-350,15 Q-500,40 -650,25" stroke="#8aa3b5" strokeWidth="4" fill="none" opacity="0.10" />
        </g>
        
        {/* Small Plane 1 */}
        <g transform="translate(200, 180) rotate(20)" opacity="0.06">
          <ellipse cx="0" cy="0" rx="100" ry="18" fill="#0b2b40" />
          <ellipse cx="90" cy="0" rx="25" ry="10" fill="#2a7de1" />
          <path d="M-40,-10 L-70,-70 L-25,-18 Z" fill="#1a405a" />
          <path d="M-40,10 L-70,70 L-25,18 Z" fill="#1a405a" />
        </g>
        
        {/* Small Plane 2 */}
        <g transform="translate(950, 600) rotate(-15)" opacity="0.05">
          <ellipse cx="0" cy="0" rx="80" ry="14" fill="#0b2b40" />
          <ellipse cx="70" cy="0" rx="20" ry="8" fill="#2a7de1" />
          <path d="M-30,-8 L-55,-55 L-18,-14 Z" fill="#1a405a" />
          <path d="M-30,8 L-55,55 L-18,14 Z" fill="#1a405a" />
        </g>
        
        {/* Clouds */}
        <ellipse cx="200" cy="120" rx="150" ry="50" fill="white" opacity="0.4" />
        <ellipse cx="280" cy="100" rx="100" ry="40" fill="white" opacity="0.3" />
        <ellipse cx="850" cy="200" rx="180" ry="60" fill="white" opacity="0.3" />
        <ellipse cx="950" cy="180" rx="120" ry="45" fill="white" opacity="0.25" />
        <ellipse cx="100" cy="650" rx="140" ry="50" fill="white" opacity="0.35" />
        <ellipse cx="900" cy="700" rx="200" ry="65" fill="white" opacity="0.3" />
        <ellipse cx="500" cy="750" rx="160" ry="55" fill="white" opacity="0.25" />
        
        {/* Small Clouds */}
        <ellipse cx="400" cy="300" rx="80" ry="30" fill="white" opacity="0.2" />
        <ellipse cx="700" cy="450" rx="90" ry="35" fill="white" opacity="0.15" />
        <ellipse cx="300" cy="500" rx="70" ry="25" fill="white" opacity="0.2" />
      </svg>
    </div>
  );
};

export default AirplaneBackground;