import React, { useState, useEffect } from 'react';
import { getPosts } from '../api';
import { JobCard } from '../components/JobCard';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, SearchIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTitle, setSearchTitle] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [searchTitle, user]);

  const fetchPosts = async () => {
    try {
      const response = await getPosts(searchTitle);
      if (user) {
        const filteredPosts = response.data.filter((post: Post) => post.user_id !== user?.id);
        setPosts(filteredPosts);
      } else {
        setPosts(response.data); // Fetch all posts if no user is logged in
      }
    } catch (error) {
      toast.error('Failed to fetch jobs');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {user && (
          <button
            onClick={() => {}}
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Post Job
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <JobCard
            key={post.id}
            post={post}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>

    </div>
  );
};
