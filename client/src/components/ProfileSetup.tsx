import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UserStatus, ExperienceLevel, PMFocus, Industry, CompanyStage, Skill, Interest, UserLocation, PrivacySettings } from '../types';
import { userAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

interface ProfileSetupProps {
  user?: Partial<UserProfile>;
  onComplete?: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onComplete }) => {
  const { user: authUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    avatar: string;
    status: UserStatus;
    experience: ExperienceLevel;
    pmFocus: PMFocus[];
    industry: Industry[];
    companyStage: CompanyStage[];
    skills: Skill[];
    interests: Interest[];
    location: UserLocation;
    privacy: PrivacySettings;
  }>({
    name: '',
    email: '',
    avatar: '',
    status: 'current-employee',
    experience: 'pm',
    pmFocus: [],
    industry: [],
    companyStage: [],
    skills: [],
    interests: [],
    location: {
      country: 'United States',
      state: '',
      city: '',
      zipCode: '',
      coordinates: undefined,
      isVisible: true,
    },
    privacy: {
      showLocation: true,
      showExperience: true,
      showCompany: true,
      allowConnections: true,
      anonymousMode: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || authUser?.name || '',
        email: user.email || authUser?.email || '',
        avatar: user.avatar || '',
        status: user.status || 'current-employee',
        experience: user.experience || 'pm',
        pmFocus: user.pmFocus || [],
        industry: user.industry || [],
        companyStage: user.companyStage || [],
        skills: user.skills || [],
        interests: user.interests || [],
        location: user.location ? {
          country: user.location.country || 'United States',
          state: user.location.state || '',
          city: user.location.city || '',
          zipCode: user.location.zipCode || '',
          coordinates: user.location.coordinates,
          isVisible: user.location.isVisible ?? true,
        } : {
          country: 'United States',
          state: '',
          city: '',
          zipCode: '',
          coordinates: undefined,
          isVisible: true,
        },
        privacy: user.privacy || formData.privacy,
      });
      setAvatarPreview(user.avatar || authUser?.picture || '');
    } else {
      // For new users, pre-populate with auth data
      setFormData(prev => ({
        ...prev,
        name: authUser?.name || '',
        email: authUser?.email || '',
      }));
      setAvatarPreview(authUser?.picture || '');
    }
  }, [user, authUser]);

  const statusOptions: { value: UserStatus; label: string }[] = [
    { value: 'job-seeker', label: 'Actively Job Seeking' },
    { value: 'current-employee', label: 'Currently Employed' },
    { value: 'open-to-opportunities', label: 'Open to Opportunities' },
    { value: 'hiring-manager', label: 'Hiring Manager' },
  ];

  const experienceOptions: { value: ExperienceLevel; label: string }[] = [
    { value: 'intern', label: 'Intern' },
    { value: 'associate-pm', label: 'Associate PM (0-2 years)' },
    { value: 'pm', label: 'Product Manager (3-5 years)' },
    { value: 'senior-pm', label: 'Senior PM (5-8 years)' },
    { value: 'principal-pm', label: 'Principal PM (8+ years)' },
    { value: 'director-plus', label: 'Director+ (Leadership)' },
  ];

  const pmFocusOptions: { value: PMFocus; label: string }[] = [
    { value: 'technical-pm', label: 'Technical PM' },
    { value: 'growth-pm', label: 'Growth PM' },
    { value: 'data-pm', label: 'Data PM' },
    { value: 'ai-ml-pm', label: 'AI/ML PM' },
    { value: 'platform-pm', label: 'Platform PM' },
    { value: 'consumer-pm', label: 'Consumer PM' },
    { value: 'b2b-pm', label: 'B2B PM' },
    { value: 'product-ops', label: 'Product Operations' },
  ];

  const industryOptions: { value: Industry; label: string }[] = [
    { value: 'saas', label: 'SaaS' },
    { value: 'e-commerce', label: 'E-commerce' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'fintech', label: 'Fintech' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'edtech', label: 'EdTech' },
    { value: 'crypto', label: 'Crypto/Blockchain' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'media', label: 'Media/Entertainment' },
    { value: 'real-estate', label: 'Real Estate' },
  ];

  const companyStageOptions: { value: CompanyStage; label: string }[] = [
    { value: 'pre-seed', label: 'Pre-seed' },
    { value: 'seed', label: 'Seed' },
    { value: 'series-a', label: 'Series A' },
    { value: 'series-b', label: 'Series B' },
    { value: 'series-c', label: 'Series C+' },
    { value: 'late-stage', label: 'Late Stage' },
    { value: 'public', label: 'Public Company' },
    { value: 'enterprise', label: 'Established Enterprise' },
  ];

  const skillOptions: { value: Skill; label: string }[] = [
    { value: 'strategy', label: 'Strategy' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'technical', label: 'Technical' },
    { value: 'design', label: 'Design' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'go-to-market', label: 'Go-to-Market' },
    { value: 'user-research', label: 'User Research' },
    { value: 'data-analysis', label: 'Data Analysis' },
  ];

  const interestOptions: { value: Interest; label: string }[] = [
    { value: 'mentoring', label: 'Mentoring' },
    { value: 'job-hunting', label: 'Job Hunting' },
    { value: 'networking', label: 'Networking' },
    { value: 'knowledge-sharing', label: 'Knowledge Sharing' },
    { value: 'startup-founding', label: 'Startup Founding' },
    { value: 'investing', label: 'Investing' },
  ];

  const stateOptions = [
    { value: 'AL', label: 'Alabama', coordinates: { lat: 32.3617, lng: -86.2792 } },
    { value: 'AK', label: 'Alaska', coordinates: { lat: 64.0685, lng: -152.2782 } },
    { value: 'AZ', label: 'Arizona', coordinates: { lat: 34.2744, lng: -111.2847 } },
    { value: 'AR', label: 'Arkansas', coordinates: { lat: 34.7519, lng: -92.1313 } },
    { value: 'CA', label: 'California', coordinates: { lat: 36.7783, lng: -119.4179 } },
    { value: 'CO', label: 'Colorado', coordinates: { lat: 39.5501, lng: -105.7821 } },
    { value: 'CT', label: 'Connecticut', coordinates: { lat: 41.6032, lng: -73.0877 } },
    { value: 'DE', label: 'Delaware', coordinates: { lat: 38.9108, lng: -75.5277 } },
    { value: 'FL', label: 'Florida', coordinates: { lat: 27.7663, lng: -81.6868 } },
    { value: 'GA', label: 'Georgia', coordinates: { lat: 32.1656, lng: -82.9001 } },
    { value: 'HI', label: 'Hawaii', coordinates: { lat: 19.8968, lng: -155.5828 } },
    { value: 'ID', label: 'Idaho', coordinates: { lat: 44.0682, lng: -114.7420 } },
    { value: 'IL', label: 'Illinois', coordinates: { lat: 40.6331, lng: -89.3985 } },
    { value: 'IN', label: 'Indiana', coordinates: { lat: 40.2732, lng: -86.1349 } },
    { value: 'IA', label: 'Iowa', coordinates: { lat: 41.8780, lng: -93.0977 } },
    { value: 'KS', label: 'Kansas', coordinates: { lat: 38.5266, lng: -96.7265 } },
    { value: 'KY', label: 'Kentucky', coordinates: { lat: 37.8393, lng: -84.2700 } },
    { value: 'LA', label: 'Louisiana', coordinates: { lat: 31.2448, lng: -92.1450 } },
    { value: 'ME', label: 'Maine', coordinates: { lat: 45.2538, lng: -69.4455 } },
    { value: 'MD', label: 'Maryland', coordinates: { lat: 39.0458, lng: -76.6413 } },
    { value: 'MA', label: 'Massachusetts', coordinates: { lat: 42.4072, lng: -71.3824 } },
    { value: 'MI', label: 'Michigan', coordinates: { lat: 44.3467, lng: -85.4102 } },
    { value: 'MN', label: 'Minnesota', coordinates: { lat: 46.7296, lng: -94.6859 } },
    { value: 'MS', label: 'Mississippi', coordinates: { lat: 32.3547, lng: -89.3985 } },
    { value: 'MO', label: 'Missouri', coordinates: { lat: 37.9643, lng: -91.8318 } },
    { value: 'MT', label: 'Montana', coordinates: { lat: 47.0527, lng: -109.6333 } },
    { value: 'NE', label: 'Nebraska', coordinates: { lat: 41.4925, lng: -99.9018 } },
    { value: 'NV', label: 'Nevada', coordinates: { lat: 38.8026, lng: -116.4194 } },
    { value: 'NH', label: 'New Hampshire', coordinates: { lat: 43.1939, lng: -71.5724 } },
    { value: 'NJ', label: 'New Jersey', coordinates: { lat: 40.0583, lng: -74.4057 } },
    { value: 'NM', label: 'New Mexico', coordinates: { lat: 34.5199, lng: -105.8701 } },
    { value: 'NY', label: 'New York', coordinates: { lat: 40.7128, lng: -74.0060 } },
    { value: 'NC', label: 'North Carolina', coordinates: { lat: 35.7596, lng: -79.0193 } },
    { value: 'ND', label: 'North Dakota', coordinates: { lat: 47.5515, lng: -101.0020 } },
    { value: 'OH', label: 'Ohio', coordinates: { lat: 40.4173, lng: -82.9071 } },
    { value: 'OK', label: 'Oklahoma', coordinates: { lat: 35.0078, lng: -97.0929 } },
    { value: 'OR', label: 'Oregon', coordinates: { lat: 43.8041, lng: -120.5542 } },
    { value: 'PA', label: 'Pennsylvania', coordinates: { lat: 41.2033, lng: -77.1945 } },
    { value: 'RI', label: 'Rhode Island', coordinates: { lat: 41.6800, lng: -71.5118 } },
    { value: 'SC', label: 'South Carolina', coordinates: { lat: 33.8361, lng: -81.1637 } },
    { value: 'SD', label: 'South Dakota', coordinates: { lat: 43.9695, lng: -99.9018 } },
    { value: 'TN', label: 'Tennessee', coordinates: { lat: 35.8580, lng: -86.3505 } },
    { value: 'TX', label: 'Texas', coordinates: { lat: 31.9686, lng: -99.9018 } },
    { value: 'UT', label: 'Utah', coordinates: { lat: 39.3210, lng: -111.0937 } },
    { value: 'VT', label: 'Vermont', coordinates: { lat: 44.5588, lng: -72.5805 } },
    { value: 'VA', label: 'Virginia', coordinates: { lat: 37.4316, lng: -78.6569 } },
    { value: 'WA', label: 'Washington', coordinates: { lat: 47.7511, lng: -120.7401 } },
    { value: 'WV', label: 'West Virginia', coordinates: { lat: 38.6409, lng: -80.6227 } },
    { value: 'WI', label: 'Wisconsin', coordinates: { lat: 43.7844, lng: -88.7879 } },
    { value: 'WY', label: 'Wyoming', coordinates: { lat: 43.0759, lng: -107.2903 } },
    // Canadian provinces
    { value: 'AB', label: 'Alberta', coordinates: { lat: 53.9333, lng: -116.5765 } },
    { value: 'BC', label: 'British Columbia', coordinates: { lat: 53.7267, lng: -127.6476 } },
    { value: 'MB', label: 'Manitoba', coordinates: { lat: 53.7609, lng: -98.8139 } },
    { value: 'NB', label: 'New Brunswick', coordinates: { lat: 46.5653, lng: -66.4619 } },
    { value: 'NL', label: 'Newfoundland and Labrador', coordinates: { lat: 53.1355, lng: -57.6604 } },
    { value: 'NS', label: 'Nova Scotia', coordinates: { lat: 44.6820, lng: -63.7443 } },
    { value: 'ON', label: 'Ontario', coordinates: { lat: 51.2538, lng: -85.3232 } },
    { value: 'PE', label: 'Prince Edward Island', coordinates: { lat: 46.5107, lng: -63.4168 } },
    { value: 'QC', label: 'Quebec', coordinates: { lat: 53.9333, lng: -73.8667 } },
    { value: 'SK', label: 'Saskatchewan', coordinates: { lat: 52.9399, lng: -106.4509 } },
    { value: 'NT', label: 'Northwest Territories', coordinates: { lat: 61.2181, lng: -113.5034 } },
    { value: 'NU', label: 'Nunavut', coordinates: { lat: 70.2998, lng: -83.1076 } },
    { value: 'YT', label: 'Yukon', coordinates: { lat: 64.2823, lng: -135.0000 } }
  ];

  const cityOptions: { [key: string]: Array<{ value: string; label: string; coordinates: { lat: number; lng: number } }> } = {
    'CA': [
      { value: 'Los Angeles', label: 'Los Angeles', coordinates: { lat: 34.0522, lng: -118.2437 } },
      { value: 'San Francisco', label: 'San Francisco', coordinates: { lat: 37.7749, lng: -122.4194 } },
      { value: 'San Diego', label: 'San Diego', coordinates: { lat: 32.7157, lng: -117.1611 } },
      { value: 'San Jose', label: 'San Jose', coordinates: { lat: 37.3382, lng: -121.8863 } },
      { value: 'Sacramento', label: 'Sacramento', coordinates: { lat: 38.5816, lng: -121.4944 } },
      { value: 'Oakland', label: 'Oakland', coordinates: { lat: 37.8044, lng: -122.2712 } },
      { value: 'Palo Alto', label: 'Palo Alto', coordinates: { lat: 37.4419, lng: -122.1430 } },
      { value: 'Mountain View', label: 'Mountain View', coordinates: { lat: 37.3861, lng: -122.0839 } }
    ],
    'NY': [
      { value: 'New York City', label: 'New York City', coordinates: { lat: 40.7128, lng: -74.0060 } },
      { value: 'Brooklyn', label: 'Brooklyn', coordinates: { lat: 40.6782, lng: -73.9442 } },
      { value: 'Albany', label: 'Albany', coordinates: { lat: 42.6526, lng: -73.7562 } },
      { value: 'Buffalo', label: 'Buffalo', coordinates: { lat: 42.8864, lng: -78.8784 } },
      { value: 'Rochester', label: 'Rochester', coordinates: { lat: 43.1566, lng: -77.6088 } }
    ],
    'TX': [
      { value: 'Austin', label: 'Austin', coordinates: { lat: 30.2672, lng: -97.7431 } },
      { value: 'Houston', label: 'Houston', coordinates: { lat: 29.7604, lng: -95.3698 } },
      { value: 'Dallas', label: 'Dallas', coordinates: { lat: 32.7767, lng: -96.7970 } },
      { value: 'San Antonio', label: 'San Antonio', coordinates: { lat: 29.4241, lng: -98.4936 } }
    ],
    'WA': [
      { value: 'Seattle', label: 'Seattle', coordinates: { lat: 47.6062, lng: -122.3321 } },
      { value: 'Bellevue', label: 'Bellevue', coordinates: { lat: 47.6101, lng: -122.2015 } },
      { value: 'Redmond', label: 'Redmond', coordinates: { lat: 47.6740, lng: -122.1215 } }
    ],
    'IL': [
      { value: 'Chicago', label: 'Chicago', coordinates: { lat: 41.8781, lng: -87.6298 } }
    ],
    'MA': [
      { value: 'Boston', label: 'Boston', coordinates: { lat: 42.3601, lng: -71.0589 } },
      { value: 'Cambridge', label: 'Cambridge', coordinates: { lat: 42.3736, lng: -71.1097 } }
    ],
    'CO': [
      { value: 'Denver', label: 'Denver', coordinates: { lat: 39.7392, lng: -104.9903 } },
      { value: 'Boulder', label: 'Boulder', coordinates: { lat: 40.0150, lng: -105.2705 } }
    ],
    'FL': [
      { value: 'Miami', label: 'Miami', coordinates: { lat: 25.7617, lng: -80.1918 } },
      { value: 'Tampa', label: 'Tampa', coordinates: { lat: 27.9506, lng: -82.4572 } },
      { value: 'Orlando', label: 'Orlando', coordinates: { lat: 28.5383, lng: -81.3792 } }
    ],
    'GA': [
      { value: 'Atlanta', label: 'Atlanta', coordinates: { lat: 33.7490, lng: -84.3880 } }
    ],
    'NC': [
      { value: 'Charlotte', label: 'Charlotte', coordinates: { lat: 35.2271, lng: -80.8431 } },
      { value: 'Raleigh', label: 'Raleigh', coordinates: { lat: 35.7796, lng: -78.6382 } }
    ],
    'VA': [
      { value: 'Richmond', label: 'Richmond', coordinates: { lat: 37.5407, lng: -77.4360 } },
      { value: 'Virginia Beach', label: 'Virginia Beach', coordinates: { lat: 36.8529, lng: -75.9780 } }
    ],
    'OR': [
      { value: 'Portland', label: 'Portland', coordinates: { lat: 45.5152, lng: -122.6784 } }
    ],
    'UT': [
      { value: 'Salt Lake City', label: 'Salt Lake City', coordinates: { lat: 40.7608, lng: -111.8910 } }
    ],
    'NV': [
      { value: 'Las Vegas', label: 'Las Vegas', coordinates: { lat: 36.1699, lng: -115.1398 } }
    ],
    'ON': [
      { value: 'Toronto', label: 'Toronto', coordinates: { lat: 43.6532, lng: -79.3832 } },
      { value: 'Ottawa', label: 'Ottawa', coordinates: { lat: 45.4215, lng: -75.6972 } },
      { value: 'Waterloo', label: 'Waterloo', coordinates: { lat: 43.4643, lng: -80.5204 } }
    ],
    'BC': [
      { value: 'Vancouver', label: 'Vancouver', coordinates: { lat: 49.2827, lng: -123.1207 } }
    ],
    'QC': [
      { value: 'Montreal', label: 'Montreal', coordinates: { lat: 45.5017, lng: -73.5673 } }
    ]
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter((item: string) => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Avatar file size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Avatar must be an image file');
        return;
      }

      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = () => {
    setAvatarPreview('');
    setFormData(prev => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCoordinatesFromDropdowns = (city: string, state: string) => {
    // First try to get exact city coordinates
    const stateCities = cityOptions[state];
    if (stateCities) {
      const cityData = stateCities.find(c => c.value === city);
      if (cityData) {
        console.log(`Found exact coordinates for ${city}, ${state}:`, cityData.coordinates);
        return cityData.coordinates;
      }
    }

    // Fall back to state center coordinates
    const stateData = stateOptions.find(s => s.value === state);
    if (stateData) {
      console.log(`Using state center coordinates for ${state}:`, stateData.coordinates);
      return stateData.coordinates;
    }

    console.log(`No coordinates found for ${city}, ${state}`);
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let updatedFormData = { ...formData };

      // Get coordinates from dropdown selections
      if (formData.location.city && formData.location.state) {
        const coordinates = getCoordinatesFromDropdowns(
          formData.location.city,
          formData.location.state
        );

        if (coordinates) {
          updatedFormData = {
            ...formData,
            location: {
              ...formData.location,
              coordinates
            }
          };
          console.log('Profile will be saved with coordinates:', coordinates);
        } else {
          console.log('No coordinates found - profile saved without map location');
        }
      }

      await userAPI.updateProfile(updatedFormData);
      onComplete?.();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Avatar and Name Section */}
          <div className="mb-8 flex flex-col items-center space-y-4">
            <div className="relative">
              <div
                onClick={handleAvatarClick}
                className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow relative overflow-hidden group"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100">
                    <svg className="w-12 h-12 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {avatarPreview ? 'Change Photo' : 'Upload Photo'}
              </button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your display name"
            />
            <p className="text-xs text-gray-500 mt-1">This name will be visible to other users</p>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your contact email"
            />
            <p className="text-xs text-gray-500 mt-1">Other users can contact you through this email</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as UserStatus }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                required
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value as ExperienceLevel }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select experience</option>
                {experienceOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* PM Focus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PM Focus Areas * (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {pmFocusOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.pmFocus.includes(option.value)}
                    onChange={() => handleMultiSelect('pmFocus', option.value)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry Experience (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {industryOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.industry.includes(option.value)}
                    onChange={() => handleMultiSelect('industry', option.value)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Company Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Stage Experience
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {companyStageOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.companyStage.includes(option.value)}
                    onChange={() => handleMultiSelect('companyStage', option.value)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Skills
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {skillOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(option.value)}
                    onChange={() => handleMultiSelect('skills', option.value)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests & Goals
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {interestOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(option.value)}
                    onChange={() => handleMultiSelect('interests', option.value)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                <select
                  required
                  value={formData.location.state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        state: newState,
                        city: '' // Reset city when state changes
                      }
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select State/Province</option>
                  {stateOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <select
                  value={formData.location.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={!formData.location.state}
                >
                  <option value="">Select City (Optional)</option>
                  {formData.location.state && cityOptions[formData.location.state]?.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {!formData.location.state && (
                  <p className="text-xs text-gray-500 mt-1">Select a state first</p>
                )}
                {formData.location.state && !cityOptions[formData.location.state] && (
                  <p className="text-xs text-gray-500 mt-1">Will use state center location</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                <input
                  type="text"
                  value={formData.location.zipCode}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, zipCode: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 94102"
                />
                <p className="text-xs text-gray-500 mt-1">Optional - for networking in your area</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                📍 Your location will be automatically placed on the map based on your selections
              </p>
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacy.showLocation}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, showLocation: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Show my location on the map</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacy.allowConnections}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, allowConnections: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Allow connection requests</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;