import React from 'react';
import { useAuth } from '../hooks/useAuth';

const LandingPage: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect with Product Managers
            <span className="block text-primary-600">Across North America</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the premier networking platform for Product Managers. Discover opportunities,
            share experiences, and build meaningful connections with fellow PMs in your area and beyond.
          </p>
          <button
            onClick={login}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </button>
        </div>

        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
            <p className="text-gray-600">Find and connect with PMs in your city or explore talent across regions.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold mb-2">Community Forum</h3>
            <p className="text-gray-600">Share insights, ask questions, and learn from experienced product leaders.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">Resource Hub</h3>
            <p className="text-gray-600">Access curated learning materials, tools, and career development resources.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-600">Get matched with PMs based on experience, interests, and career goals.</p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Trusted by Product Managers at</h2>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <span className="text-2xl font-bold">Google</span>
            <span className="text-2xl font-bold">Meta</span>
            <span className="text-2xl font-bold">Amazon</span>
            <span className="text-2xl font-bold">Microsoft</span>
            <span className="text-2xl font-bold">Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;