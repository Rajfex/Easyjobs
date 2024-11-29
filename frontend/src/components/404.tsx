import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col items-center">
        <BriefcaseIcon className="h-12 w-12 text-indigo-600 mb-4 2xl:h-24 2xl:w-24" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2 2xl:text-7xl">404</h1>
        <p className="text-gray-600 mb-4 2xl:text-2xl">Oops! The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
