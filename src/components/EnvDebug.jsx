// src/components/EnvDebug.jsx
import React from 'react';

const EnvDebug = () => {
  return (
    <div style={{ 
      background: '#ff6b6b', 
      color: 'white', 
      padding: '10px', 
      margin: '10px',
      borderRadius: '8px',
      fontSize: '12px'
    }}>
      <h3>🔧 Environment Debug:</h3>
      <p><strong>API Key exists:</strong> {process.env.REACT_APP_SPEECHMATICS_API_KEY ? '✅ YES' : '❌ NO'}</p>
      <p><strong>API Key preview:</strong> {process.env.REACT_APP_SPEECHMATICS_API_KEY ? 
        process.env.REACT_APP_SPEECHMATICS_API_KEY.substring(0, 10) + '...' : 'NOT FOUND'}</p>
      <p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
    </div>
  );
};

export default EnvDebug;