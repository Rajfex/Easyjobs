import React, { useState } from 'react';
import { Post } from '../types';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { deletePost, updatePost } from '../api';
import toast from 'react-hot-toast';

interface JobCardProps {
  post: Post;
}

export const JobCard: React.FC<JobCardProps> = ({ post }) => {
  const { user } = useAuth();
  const canEdit = user?.id === post.user_id;
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    price: '',
  });
  const handleDelete = async (id: number) => {
    handleDeleteModal();
    try {
      await deletePost(id);
      toast.success('Post deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete the post.');
      console.error(error);
    }
    window.location.reload();
  };

  const handleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleEditModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleEdit = (post: Post) => {
    handleEditModal();
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      price: post.price.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      await updatePost(editingPost.id, {
        ...formData,
        price: Number(formData.price),
      });
      setIsModalOpen(false);
      setEditingPost(null);
      setFormData({ title: '', content: '', price: '' });
      toast.success('Post updated successfully.');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update the post.');
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <Link to={`/post/${post.id}`}>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
          <div className="flex items-center space-x-2">
            <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full">
              ${post.price} /hr
            </span>
          </div>
        </div>
        <p className="mt-2 text-gray-600">{post.content}</p>
      </Link>
      {canEdit && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => handleEdit(post)}
            className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteModal()}
            className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && 
          <div
            className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative">
                <svg xmlns="http://www.w3.org/2000/svg"
                  onClick={handleDeleteModal}
                    className="w-3 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right" viewBox="0 0 320.591 320.591">
                    <path
                        d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                        data-original="#000000"></path>
                    <path
                        d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                        data-original="#000000"></path>
                </svg>

                <div className="my-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-14 fill-red-500 inline" viewBox="0 0 24 24">
                    <Trash2 className="h-7 w-7 text-red-500" />
                    </svg>
                    <h4 className="text-gray-800 text-lg font-semibold mt-4">Are you sure you want to delete it?</h4>
                    <p className="text-sm text-gray-600 mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor auctor
                        arcu,
                        at fermentum dui. Maecenas</p>
                </div>

                <div className="flex flex-col space-y-2">
                    <button type="button"
                        onClick={() => handleDelete(post.id)}
                        className="px-4 py-2 rounded-lg text-white text-sm tracking-wide bg-red-500 hover:bg-red-600 active:bg-red-500">Delete</button>
                    <button type="button"
                      onClick={handleDeleteModal}
                        className="px-4 py-2 rounded-lg text-gray-800 text-sm tracking-wide bg-gray-200 hover:bg-gray-300 active:bg-gray-200">Cancel</button>
                </div>
            </div>
        </div>
      }

        {/* Edit Modal */}
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