import React from 'react';

const LeftSidebar = ({ drug }) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";

  return (
    <aside className="left-sidebar">
      {drug ? (
        <div>
          <h3>{drug.name}</h3>
          <img 
            src={`${API_URL}${drug.imageUrl}` || `${API_URL}/images/placeholder.jpg`} 
            alt={drug.name} 
            style={{ width: '100%', borderRadius: '8px' }}
          />
          <div className="health-info" style={{ marginTop: '15px' }}>
            <h4>How to Use</h4>
            <p>{drug.usageInfo || 'Usage information not available.'}</p>
          </div>
          <div className="health-info">
            <h4>Side Effects</h4>
            <p>{drug.sideEffects || 'Side effects information not available.'}</p>
          </div>
          {drug.requiresPrescription && (
            <div style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
              prescription drug.
              max 10 units.
            </div>
          )}
        </div>
      ) : (
        <div className="health-info">
          <h4>Drug Info</h4>
          <p> select a drug  to see details.</p>
        </div>
      )}
    </aside>
  );
};

export default LeftSidebar;