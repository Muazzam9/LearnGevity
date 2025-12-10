import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/admin/dashboard" className="text-2xl font-bold text-primary-navy">
                LearnGevity Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-navy mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Tutor Management Card */}
          <Link to="/admin/tutors" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-primary-purple text-4xl mb-4">👨‍🏫</div>
            <h2 className="text-xl font-bold text-primary-navy mb-2">Manage Tutors</h2>
            <p className="text-gray-600">
              Add, edit, and manage tutor profiles and accounts
            </p>
            <div className="mt-4 text-primary-purple font-semibold">
              Go to Tutors →
            </div>
          </Link>

          {/* Student Management Card */}
          <Link to="/admin/students" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-primary-orange text-4xl mb-4">📚</div>
            <h2 className="text-xl font-bold text-primary-navy mb-2">Manage Students</h2>
            <p className="text-gray-600">
              Add, edit, and track student information
            </p>
            <div className="mt-4 text-primary-purple font-semibold">
              Go to Students →
            </div>
          </Link>

          {/* Session Management Card */}
          <Link to="/admin/sessions" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-primary-navy text-4xl mb-4">📅</div>
            <h2 className="text-xl font-bold text-primary-navy mb-2">Manage Sessions</h2>
            <p className="text-gray-600">
              Schedule and manage tutoring sessions
            </p>
            <div className="mt-4 text-primary-purple font-semibold">
              Go to Sessions →
            </div>
          </Link>
        </div>

        {/* Quick Stats (placeholder) */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-primary-navy mb-4">Quick Stats</h2>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-purple">--</div>
              <div className="text-gray-600 text-sm">Active Tutors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-orange">--</div>
              <div className="text-gray-600 text-sm">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-navy">--</div>
              <div className="text-gray-600 text-sm">This Week's Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">--</div>
              <div className="text-gray-600 text-sm">Completed Sessions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

