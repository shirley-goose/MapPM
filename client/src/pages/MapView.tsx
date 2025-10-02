import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useAuth } from '../hooks/useAuth';
import { UserProfile } from '../types';
import { userAPI } from '../utils/api';

// Google Maps component
const GoogleMap: React.FC<{
  center: google.maps.LatLngLiteral;
  zoom: number;
  users: Array<UserProfile & { position: google.maps.LatLngLiteral; }>;
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
        // Create colored marker based on experience level
        const getMarkerColor = (experience: string) => {
          switch (experience) {
            case 'intern':
            case 'associate-pm': return '#10B981'; // Green
            case 'pm': return '#3B82F6'; // Blue
            case 'senior-pm': return '#8B5CF6'; // Purple
            case 'principal-pm': return '#F59E0B'; // Orange
            case 'director-plus': return '#EF4444'; // Red
            default: return '#6B7280'; // Gray
          }
        };

        const getStatusSymbol = (status: string) => {
          switch (status) {
            case 'job-seeker': return '🔍';
            case 'hiring-manager': return '📋';
            case 'open-to-opportunities': return '💼';
            case 'current-employee': return '💪';
            default: return '👤';
          }
        };

        const markerColor = getMarkerColor(user.experience);
        const statusSymbol = getStatusSymbol(user.status);

        const markerIcon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="16" fill="${markerColor}" stroke="#FFFFFF" stroke-width="3"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">${statusSymbol}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20),
        };

        const marker = new google.maps.Marker({
          position: user.position,
          map: map,
          title: user.name,
          icon: markerIcon
        });

        // Enhanced info window with profile details
        const experienceLabel = user.experience?.replace('-', ' ').toUpperCase() || 'Product Manager';
        const statusLabel = user.status?.replace('-', ' ').toUpperCase() || '';
        const pmFocusAreas = user.pmFocus?.slice(0, 3).map(focus => focus.replace('-', ' ')).join(', ') || '';
        const industries = user.industry?.slice(0, 2).map(ind => ind.replace('-', ' ')).join(', ') || '';
        const interests = user.interests?.slice(0, 2).map(int => int.replace('-', ' ')).join(', ') || '';

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 250px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <img src="${user.avatar || '/default-avatar.png'}"
                     style="width: 48px; height: 48px; border-radius: 50%; margin-right: 12px; object-fit: cover;"
                     alt="${user.name}">
                <div>
                  <h3 style="margin: 0; font-weight: 600; color: #1f2937; font-size: 16px;">${user.name}</h3>
                  <p style="margin: 2px 0; color: #6b7280; font-size: 13px;">${experienceLabel}</p>
                  ${statusLabel ? `<span style="background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 12px; font-size: 11px; font-weight: 500;">${statusLabel}</span>` : ''}
                </div>
              </div>
              ${pmFocusAreas ? `
                <div style="margin-bottom: 6px;">
                  <strong style="color: #374151; font-size: 12px;">Focus:</strong>
                  <span style="color: #6b7280; font-size: 12px;"> ${pmFocusAreas}</span>
                </div>
              ` : ''}
              ${industries ? `
                <div style="margin-bottom: 6px;">
                  <strong style="color: #374151; font-size: 12px;">Industry:</strong>
                  <span style="color: #6b7280; font-size: 12px;"> ${industries}</span>
                </div>
              ` : ''}
              ${interests ? `
                <div style="margin-bottom: 6px;">
                  <strong style="color: #374151; font-size: 12px;">Interests:</strong>
                  <span style="color: #6b7280; font-size: 12px;"> ${interests}</span>
                </div>
              ` : ''}
              ${user.location?.city && user.location?.state ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-size: 12px;">📍 ${user.location.city}, ${user.location.state}</span>
                </div>
              ` : ''}
              ${user.privacy?.allowConnections ? `
                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                  <button onclick="window.contactUser('${user.email}', '${user.name}')" style="background: #3b82f6; color: white; padding: 6px 12px; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;">
                    📧 Contact ${user.name.split(' ')[0]}
                  </button>
                </div>
              ` : ''}
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
  const { user: authUser } = useAuth();
  const [center] = useState<google.maps.LatLngLiteral>({
    lat: 43.6532, // Toronto (North America center)
    lng: -79.3832
  });
  const [zoom] = useState(4);
  const [users, setUsers] = useState<Array<UserProfile & { position: google.maps.LatLngLiteral; }>>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  // Add global contact function for map info windows
  useEffect(() => {
    (window as any).contactUser = (email: string, name: string) => {
      const senderName = currentUserProfile?.name || authUser?.name || 'MapPM User';
      const subject = encodeURIComponent(`MapPM Connection Request from ${senderName}`);
      const body = encodeURIComponent(`Hi ${name},

I found your profile on MapPM and would like to connect. I'm ${senderName} and I'm interested in networking with fellow Product Managers.

Would you be open to connecting?

Best regards,
${senderName}`);

      window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
    };

    return () => {
      delete (window as any).contactUser;
    };
  }, [authUser, currentUserProfile]);

  // Fetch users with profiles from API (simulated for now)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // First, try to get the authenticated user's profile
        let userProfile: UserProfile | null = null;
        try {
          const response = await userAPI.getProfile();
          userProfile = response.data;
          setCurrentUserProfile(userProfile);
        } catch (error) {
          // User doesn't have a profile yet
          console.log('Current user profile not found:', error);
        }

        // For now, create sample users with rich profile data
        // In a real app, this would come from your API
        const sampleUsers: Array<UserProfile & { position: google.maps.LatLngLiteral; }> = [
          {
            id: '1',
            cognitoId: 'sample1',
            email: 'sarah.chen@example.com',
            name: 'Sarah Chen',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=3b82f6&color=ffffff&size=64',
            status: 'open-to-opportunities',
            experience: 'senior-pm',
            pmFocus: ['technical-pm', 'ai-ml-pm'],
            industry: ['saas', 'fintech'],
            companyStage: ['series-b', 'public'],
            skills: ['strategy', 'technical', 'analytics'],
            interests: ['mentoring', 'networking'],
            location: {
              country: 'United States',
              state: 'California',
              city: 'San Francisco',
              coordinates: { lat: 37.7749, lng: -122.4194 },
              isVisible: true
            },
            privacy: {
              showLocation: true,
              showExperience: true,
              showCompany: true,
              allowConnections: true,
              anonymousMode: false
            },
            isProfileComplete: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            position: { lat: 37.7749, lng: -122.4194 }
          },
          {
            id: '2',
            cognitoId: 'sample2',
            email: 'mike.johnson@example.com',
            name: 'Mike Johnson',
            avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=8b5cf6&color=ffffff&size=64',
            status: 'hiring-manager',
            experience: 'director-plus',
            pmFocus: ['growth-pm', 'b2b-pm'],
            industry: ['saas', 'e-commerce'],
            companyStage: ['late-stage', 'public'],
            skills: ['leadership', 'strategy', 'go-to-market'],
            interests: ['startup-founding', 'investing'],
            location: {
              country: 'United States',
              state: 'New York',
              city: 'New York',
              coordinates: { lat: 40.7128, lng: -74.0060 },
              isVisible: true
            },
            privacy: {
              showLocation: true,
              showExperience: true,
              showCompany: true,
              allowConnections: true,
              anonymousMode: false
            },
            isProfileComplete: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            position: { lat: 40.7128, lng: -74.0060 }
          },
          {
            id: '3',
            cognitoId: 'sample3',
            email: 'emma.davis@example.com',
            name: 'Emma Davis',
            avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=10b981&color=ffffff&size=64',
            status: 'current-employee',
            experience: 'pm',
            pmFocus: ['data-pm', 'consumer-pm'],
            industry: ['healthcare', 'edtech'],
            companyStage: ['series-a', 'series-b'],
            skills: ['analytics', 'user-research', 'data-analysis'],
            interests: ['knowledge-sharing', 'mentoring'],
            location: {
              country: 'Canada',
              state: 'Ontario',
              city: 'Toronto',
              coordinates: { lat: 43.6532, lng: -79.3832 },
              isVisible: true
            },
            privacy: {
              showLocation: true,
              showExperience: true,
              showCompany: true,
              allowConnections: true,
              anonymousMode: false
            },
            isProfileComplete: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            position: { lat: 43.6532, lng: -79.3832 }
          },
          {
            id: '4',
            cognitoId: 'sample4',
            email: 'alex.rodriguez@example.com',
            name: 'Alex Rodriguez',
            avatar: 'https://ui-avatars.com/api/?name=Alex+Rodriguez&background=f59e0b&color=ffffff&size=64',
            status: 'job-seeker',
            experience: 'associate-pm',
            pmFocus: ['platform-pm', 'product-ops'],
            industry: ['gaming', 'media'],
            companyStage: ['pre-seed', 'series-a'],
            skills: ['technical', 'design'],
            interests: ['job-hunting', 'networking'],
            location: {
              country: 'United States',
              state: 'California',
              city: 'Los Angeles',
              coordinates: { lat: 34.0522, lng: -118.2437 },
              isVisible: true
            },
            privacy: {
              showLocation: true,
              showExperience: true,
              showCompany: true,
              allowConnections: true,
              anonymousMode: false
            },
            isProfileComplete: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            position: { lat: 34.0522, lng: -118.2437 }
          }
        ];

        // Add current user to the map if they have a complete profile with coordinates
        if (userProfile &&
            userProfile.location?.coordinates &&
            userProfile.privacy.showLocation) {
          const currentUserMapData = {
            ...userProfile,
            position: userProfile.location.coordinates
          };
          setUsers([currentUserMapData, ...sampleUsers]);
        } else {
          setUsers(sampleUsers);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const render = (status: Status) => {
    if (loading) {
      return <LoadingComponent />;
    }

    switch (status) {
      case Status.LOADING:
        return <LoadingComponent />;
      case Status.FAILURE:
        return <ErrorComponent status={status} />;
      case Status.SUCCESS:
        return (
          <div className="h-screen relative">
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <img src="/icon.png" alt="MapPM" className="w-6 h-6 mr-2" />
                MapPM
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Welcome, {currentUserProfile?.name || authUser?.name || 'User'}! Discover PMs near you.
              </p>
              <div className="text-xs text-gray-500">
                📍 {users.length} Product Managers visible
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">🔍 Click markers for details</span>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 max-w-xs">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Experience Levels</h3>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Associate/Intern</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Product Manager</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Senior PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Principal PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Director+</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">Icons: 🔍 Job seeking, 📋 Hiring, 💼 Open, 💪 Employed</span>
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