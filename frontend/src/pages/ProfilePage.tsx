import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPosts, refreshToken } from '../api';
import { Post } from '../types';
import { JobCard } from '../components/JobCard';
import toast from 'react-hot-toast';
export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await getUserPosts();
        setPosts(response.data);
      } catch (error: any) {
        if(error.response.status === 401) {
          try{
            refreshToken();
            window.location.reload();
          } catch (error: any) {
            console.error(error);
          }
        }
        toast.error('Failed to fetch your posts.');
        console.error(error);
      }
    };

      fetchUserPosts();
  }, []);




  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile Page</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Username</h3>
              <p className="text-lg text-gray-900">{user?.username || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-lg text-gray-900">{user?.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Other Information</h2>
          <p className="text-gray-700">
            This section can include additional features, links, or details such as:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
            <li>Saved posts or jobs</li>
            <li>Account settings</li>
            <li>Recent activity</li>
            <li>Other user-specific data</li>
          </ul>
        </div>
      </div>

      <h1 className="text-2xl font-bold my-6">Your Posts</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {posts.map((post) => (
          <JobCard
            key={post.id}
            post={post}
          />
        ))}
      </div>

    </div>
  );
};
