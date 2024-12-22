import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BriefcaseIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const router = useNavigate();
  const handleLogout = async () => {
    await logout();
    router('/');
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">EasyJobs</span>
              </Link>
            </div>
            {/* Loading placeholder */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Loading...</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">EasyJobs</span>
            </Link>
          </div>
          <div className='flex items-center space-x-4'>
            <Link
              to="/jobs"
              className="px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-50"
            >
              Jobs
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
