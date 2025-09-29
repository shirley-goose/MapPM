import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAPI } from '../hooks/useAPI';
import { userAPI } from '../utils/api';
import { UserProfile } from '../types';
import ProfileSetup from '../components/ProfileSetup';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSetup, setShowSetup] = useState(false);

  useAPI();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setUser(response.data);
        setShowSetup(!response.data.isProfileComplete);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileComplete = () => {
    setShowSetup(false);
    // Refresh user data
    window.location.reload();
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (showSetup || !user?.isProfileComplete) {
    return <ProfileSetup user={user || undefined} onComplete={handleProfileComplete} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <img
                src={authUser?.picture || '/default-avatar.png'}
                alt={authUser?.name}
                className="h-24 w-24 rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {user.experience?.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {user.status?.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSetup(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">PM Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {user.pmFocus?.map(focus => (
                  <span key={focus} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {focus.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Industry Experience</h3>
              <div className="flex flex-wrap gap-2">
                {user.industry?.map(ind => (
                  <span key={ind} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {ind.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills?.map(skill => (
                  <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    {skill.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests?.map(interest => (
                  <span key={interest} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    {interest.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {user.location && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-gray-600">
                {user.location.city}, {user.location.state}, {user.location.country}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;