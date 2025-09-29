import React from 'react';

const Resources: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resource Hub</h1>
        <p className="text-gray-600">Curated learning materials and tools for Product Managers.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Resources Coming Soon</h2>
          <p className="text-gray-600">Curated PM resources, courses, and tools will be available here.</p>
        </div>
      </div>
    </div>
  );
};

export default Resources;