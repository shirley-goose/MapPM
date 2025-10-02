import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { forumAPI } from '../utils/api';

interface ForumPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  forum_comments?: any[];
  view_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

const Forum: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });

  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await forumAPI.getPosts();
      setPosts(response.data || []);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'career-growth', label: 'Career Growth' },
    { value: 'product-strategy', label: 'Product Strategy' },
    { value: 'job-market', label: 'Job Market' },
    { value: 'interview-prep', label: 'Interview Prep' },
    { value: 'industry-news', label: 'Industry News' },
    { value: 'general', label: 'General' }
  ];

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });

    // Sort posts
    filtered.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;

      switch (sortBy) {
        case 'popular':
          return b.upvotes - a.upvotes;
        case 'discussed':
          return (b.forum_comments?.length || 0) - (a.forum_comments?.length || 0);
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [posts, searchQuery, selectedCategory, selectedTag, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      alert('Please fill in title and content');
      return;
    }

    try {
      const tagsArray = newPost.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await forumAPI.createPost({
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        tags: tagsArray
      });

      setShowNewPostModal(false);
      setNewPost({ title: '', content: '', category: 'general', tags: '' });
      fetchPosts(); // Refresh posts
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleUpvote = async (postId: string) => {
    try {
      await forumAPI.upvotePost(postId);
      // Update local state
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      ));
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ];
    const hash = tag.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">💬</span>
              Community Forum
            </h1>
            <p className="text-gray-600 mt-2">Connect, share, and learn with fellow Product Managers.</p>
          </div>
          <button
            onClick={() => setShowNewPostModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            + New Post
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="discussed">Most Discussed</option>
            </select>
          </div>
        </div>

        {/* Tag Filter */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Tags</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTag === '' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Tags
            </button>
            {allTags.slice(0, 12).map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Posts</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchPosts}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new post.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div
              key={post.id}
              className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border-l-4 ${
                post.is_pinned ? 'border-yellow-400 bg-yellow-50' : 'border-transparent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Post Header */}
                  <div className="flex items-center mb-2">
                    {post.is_pinned && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                        📌 Pinned
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {post.category.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Title and Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${getTagColor(tag)}`}
                        onClick={() => setSelectedTag(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Author and Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center mr-3 text-sm font-medium">
                        {post.author_id.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Anonymous User</p>
                        <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleUpvote(post.id)}
                        className="flex items-center text-sm text-gray-500 hover:text-primary-600 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                        {post.upvotes}
                      </button>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.forum_comments?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="What's your question or topic?"
                    maxLength={200}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{newPost.title.length}/200</p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.filter(c => c.value !== 'all').map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Share your thoughts, questions, or experiences..."
                    rows={8}
                    maxLength={10000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{newPost.content.length}/10000</p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="career-transition, technical-pm, advice (comma-separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.title || !newPost.content}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;