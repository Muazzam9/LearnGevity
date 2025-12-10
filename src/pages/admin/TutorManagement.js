import React from 'react';
import { Link } from 'react-router-dom';

const TutorManagement = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/admin/dashboard" className="text-2xl font-bold text-primary-navy">
              LearnGevity Admin
            </Link>
            <div className="ml-10 flex space-x-4">
              <Link to="/admin/tutors" className="text-primary-purple font-semibold">Tutors</Link>
              <Link to="/admin/students" className="text-gray-700 hover:text-primary-purple">Students</Link>
              <Link to="/admin/sessions" className="text-gray-700 hover:text-primary-purple">Sessions</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-navy mb-8">Tutor Management</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">Tutor management interface coming soon...</p>
          <p className="text-gray-500 mt-2">This will include CRUD operations for tutors</p>
        </div>
      </div>
    </div>
  );
};

export default TutorManagement;

