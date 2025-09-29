import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's what's happening in the PM community.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-600">Your recent connections and forum activity will appear here.</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Trending Discussions</h2>
            <p className="text-gray-600">Popular forum discussions and topics will be shown here.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Connections</p>
                <p className="text-2xl font-bold text-primary-600">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Forum Posts</p>
                <p className="text-2xl font-bold text-primary-600">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-primary-600">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Suggested Connections</h2>
            <p className="text-gray-600">PM recommendations based on your profile will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;