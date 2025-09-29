import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useAuth } from '../hooks/useAuth';

// Google Maps component
const GoogleMap: React.FC<{
  center: google.maps.LatLngLiteral;
  zoom: number;
  users: Array<{ id: string; name: string; position: google.maps.LatLngLiteral; }>;
}> = ({ center, zoom, users }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const mapInstance = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(mapInstance);
    }
  }, [ref, map, center, zoom]);

  // Add markers for users
  useEffect(() => {
    if (map && users.length > 0) {
      users.forEach(user => {
        const marker = new google.maps.Marker({
          position: user.position,
          map: map,
          title: user.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="#FFFFFF" stroke-width="3"/>
                <text x="16" y="20" text-anchor="middle" fill="white" font-size="14" font-weight="bold">👤</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-gray-800">${user.name}</h3>
              <p class="text-sm text-gray-600">Product Manager</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
    }
  }, [map, users]);

  return <div ref={ref} className="w-full h-full" />;
};

// Loading component
const LoadingComponent: React.FC = () => (
  <div className="h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Google Maps...</p>
    </div>
  </div>
);

// Error component
const ErrorComponent: React.FC<{ status: Status }> = ({ status }) => (
  <div className="h-screen flex items-center justify-center bg-red-50">
    <div className="text-center">
      <div className="text-6xl mb-4">❌</div>
      <h2 className="text-2xl font-bold text-red-700 mb-2">Map Loading Error</h2>
      <p className="text-red-600">Status: {status}</p>
      <p className="text-sm text-gray-600 mt-2">Please check your internet connection and try again.</p>
    </div>
  </div>
);

const MapView: React.FC = () => {
  const { user } = useAuth();
  const [center] = useState<google.maps.LatLngLiteral>({
    lat: 43.6532, // Toronto (North America center)
    lng: -79.3832
  });
  const [zoom] = useState(4);

  // Sample users data - this will come from your API later
  const [users] = useState([
    {
      id: '1',
      name: 'Sarah Chen',
      position: { lat: 37.7749, lng: -122.4194 } // San Francisco
    },
    {
      id: '2',
      name: 'Mike Johnson',
      position: { lat: 40.7128, lng: -74.0060 } // New York
    },
    {
      id: '3',
      name: 'Emma Davis',
      position: { lat: 43.6532, lng: -79.3832 } // Toronto
    },
    {
      id: '4',
      name: 'Alex Rodriguez',
      position: { lat: 34.0522, lng: -118.2437 } // Los Angeles
    },
    {
      id: '5',
      name: 'Current User',
      position: { lat: 47.6062, lng: -122.3321 } // Seattle - placeholder for current user
    }
  ]);

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingComponent />;
      case Status.FAILURE:
        return <ErrorComponent status={status} />;
      case Status.SUCCESS:
        return (
          <div className="h-screen relative">
            {/* Map Controls */}
            <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                🗺️ Product Manager Network
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Welcome, {user?.name || 'User'}! Discover PMs near you.
              </p>
              <div className="text-xs text-gray-500">
                📍 {users.length} Product Managers visible
              </div>
            </div>

            {/* Map Search */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-white rounded-lg shadow-lg p-3">
                <input
                  type="text"
                  placeholder="Search locations..."
                  className="w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Legend</h3>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Product Managers</span>
              </div>
            </div>

            {/* Google Map */}
            <GoogleMap center={center} zoom={zoom} users={users} />
          </div>
        );
    }
  };

  return (
    <Wrapper
      apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!}
      render={render}
    />
  );
};

export default MapView;