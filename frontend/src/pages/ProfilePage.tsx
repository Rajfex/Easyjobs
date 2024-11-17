import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPosts, updatePost, deletePost } from '../api';
import { Post } from '../types';
import { JobCard } from '../components/JobCard';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    price: '',
  });

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await getUserPosts();
        setPosts(response.data);
      } catch (error) {
        toast.error('Failed to fetch your posts.');
        console.error(error);
      }
    };

    fetchUserPosts();
  }, []);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      price: post.price.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      toast.success('Post deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete the post.');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      await updatePost(editingPost.id, {
        ...formData,
        price: Number(formData.price),
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editingPost.id ? { ...post, ...formData, price: Number(formData.price) } : post
        )
      );
      setIsModalOpen(false);
      setEditingPost(null);
      setFormData({ title: '', content: '', price: '' });
      toast.success('Post updated successfully.');
    } catch (error) {
      toast.error('Failed to update the post.');
      console.error(error);
    }
  };

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
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Edit Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($/hr)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPost(null);
                    setFormData({ title: '', content: '', price: '' });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
