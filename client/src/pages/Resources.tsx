import React from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'Learning' | 'Job Search' | 'AI Tools';
  icon: string;
  type: 'YouTube' | 'Platform' | 'Tool';
}

const Resources: React.FC = () => {
  const resources: Resource[] = [
    {
      id: '1',
      title: 'JJ Never Sleeps',
      description: 'YouTube channel with product management insights, career advice, and industry trends.',
      url: 'https://www.youtube.com/@jjneversleeps',
      category: 'Learning',
      icon: '📺',
      type: 'YouTube'
    },
    {
      id: '2',
      title: 'GiveAndTake.ai',
      description: 'AI-powered job application process aid to streamline your job search and application strategy.',
      url: 'https://giveandtake.ai',
      category: 'AI Tools',
      icon: '🤖',
      type: 'Tool'
    },
    {
      id: '3',
      title: 'SJob.ai',
      description: 'AI-driven job seeking platform that matches you with relevant product management opportunities.',
      url: 'https://sjob.ai',
      category: 'Job Search',
      icon: '🎯',
      type: 'Platform'
    },
    {
      id: '4',
      title: 'JobRight.ai',
      description: 'Smart job search platform leveraging AI to find the right PM roles for your career level.',
      url: 'https://jobright.ai',
      category: 'Job Search',
      icon: '💼',
      type: 'Platform'
    }
  ];

  const categories = ['Learning', 'Job Search', 'AI Tools'] as const;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Learning': return 'bg-blue-100 text-blue-800';
      case 'Job Search': return 'bg-green-100 text-green-800';
      case 'AI Tools': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">📚</span>
          Resource Hub
        </h1>
        <p className="text-gray-600 mt-2">Curated learning materials and tools for Product Managers.</p>
      </div>

      {categories.map((category) => {
        const categoryResources = resources.filter(r => r.category === category);
        if (categoryResources.length === 0) return null;

        return (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">
                {category === 'Learning' && '🎓'}
                {category === 'Job Search' && '🔍'}
                {category === 'AI Tools' && '🤖'}
              </span>
              {category}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{resource.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(resource.category)}`}>
                          {resource.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Visit Resource
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Have a Resource to Share?</h3>
          <p className="text-gray-600 text-sm">
            Know of other great PM resources? Share them with the community through our forum or contact us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resources;