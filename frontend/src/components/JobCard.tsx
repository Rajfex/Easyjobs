import React from 'react';
import { Post } from '../types';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface JobCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ post, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canEdit = user?.id === post.user_id;

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
            onClick={() => onEdit(post)}
            className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};