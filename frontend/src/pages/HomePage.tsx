import React, { useState, useEffect } from 'react';
import { createPost, getPosts } from '../api';
import { JobCard } from '../components/JobCard';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, SearchIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCategories } from '../context/CategoriesContext';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addPostData, setAddPostData] = useState({
    'title': '',
    'content': '',
    'price': ''
  })
  const categories = useCategories().categories;
  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const handleAddPost = () => {
    setIsModalOpen(false);
    createPost({
      title: addPostData.title,
      content: addPostData.content,
      price: Number(addPostData.price)
    });
  }

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
            onClick={handleModal}
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Post Job
          </button>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1">
        {posts.map((post) => (
          <JobCard
            key={post.id}
            post={post}
            categories={categories}
          />
        ))}
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add Job Offer</h2>
            <form className="space-y-4" onSubmit={handleModal}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  onChange={(e) => {setAddPostData({ ...addPostData, 'title': e.target.value })}}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => {setAddPostData({ ...addPostData, 'content': e.target.value })}}
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($/hr)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => {setAddPostData({ ...addPostData, 'price': e.target.value })}}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleAddPost}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Add Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
