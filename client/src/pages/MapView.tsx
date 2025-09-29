import React from 'react';

const MapView: React.FC = () => {
  return (
    <div className="h-screen relative">
      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Interactive Map Coming Soon</h2>
          <p className="text-gray-600">Google Maps integration will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default MapView;