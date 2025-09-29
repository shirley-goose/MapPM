import React, { useState, useEffect } from 'react';
import { UserProfile, UserStatus, ExperienceLevel, PMFocus, Industry, CompanyStage, Skill, Interest } from '../types';
import { userAPI } from '../utils/api';

interface ProfileSetupProps {
  user?: Partial<UserProfile>;
  onComplete?: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onComplete }) => {
  const [formData, setFormData] = useState({
    status: 'current-employee' as UserStatus,
    experience: 'pm' as ExperienceLevel,
    pmFocus: [] as PMFocus[],
    industry: [] as Industry[],
    companyStage: [] as CompanyStage[],
    skills: [] as Skill[],
    interests: [] as Interest[],
    location: {
      country: 'United States',
      state: '',
      city: '',
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

  useEffect(() => {
    if (user) {
      setFormData({
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
          isVisible: user.location.isVisible ?? true,
        } : formData.location,
        privacy: user.privacy || formData.privacy,
      });
    }
  }, [user]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await userAPI.updateProfile(formData);
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, state: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., California"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., San Francisco"
                />
              </div>
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